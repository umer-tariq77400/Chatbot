from django.http import JsonResponse, StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
from .utils import client, SYSTEM_INSTRUCTION

@require_POST
@csrf_exempt # For simplicity in this demo, ideally use CSRF token
def chat_message(request):
    try:
        data = json.loads(request.body)
        user_message = data.get('message')

        if not user_message:
            return JsonResponse({'error': 'No message provided'}, status=400)

        # We want to stream the response back to the client
        # If the GenAI client isn't configured (missing API_KEY), produce a
        # single SSE message explaining the problem rather than raising an
        # AttributeError when views tries to use client.chats.
        if client is None:
            def bad_config_stream():
                yield f"data: {json.dumps({'text': 'Server configuration error: API_KEY not set on server'})}\n\n"
                yield "data: [DONE]\n\n"

            return StreamingHttpResponse(bad_config_stream(), content_type='text/event-stream')
        def event_stream():
            # We can maintain a simple history if we wanted, but for now just stateless
            # To support history, we would need to accept 'history' from frontend or store in session.
            # The React app maintained history in the `chatSession` object in the browser memory (via the JS SDK).
            # Since we are moving logic to backend, we either need to:
            # 1. Pass history from frontend to backend.
            # 2. Store history in backend session.
            # 3. Just do single-turn for now (simplest path to working app given instructions).

            # Let's try to implement streaming response
            try:
                chat = client.chats.create(
                    model='gemini-2.5-flash',
                    config={
                        'system_instruction': SYSTEM_INSTRUCTION,
                        'temperature': 0.7,
                    }
                )

                response = chat.send_message_stream(user_message)

                for chunk in response:
                    # The SDK's streaming chunk shape can vary depending on the
                    # version. Try multiple common access patterns so we don't
                    # accidentally return empty text to the frontend.
                    chunk_text = None

                    # 1) Some SDKs provide .text
                    if hasattr(chunk, 'text') and getattr(chunk, 'text'):
                        chunk_text = getattr(chunk, 'text')

                    # 2) Some SDKs deliver a .delta object or dict
                    elif hasattr(chunk, 'delta') and getattr(chunk, 'delta'):
                        delta = getattr(chunk, 'delta')
                        try:
                            # delta might be dict-like
                            if isinstance(delta, dict):
                                chunk_text = delta.get('content') or delta.get('text')
                            else:
                                chunk_text = str(delta)
                        except Exception:
                            chunk_text = str(delta)

                    # 3) Some SDKs embed the content under message or output
                    elif hasattr(chunk, 'message') and getattr(chunk, 'message'):
                        try:
                            msg = getattr(chunk, 'message')
                            # try common attr names
                            if hasattr(msg, 'content') and getattr(msg, 'content'):
                                chunk_text = getattr(msg, 'content')
                            else:
                                chunk_text = str(msg)
                        except Exception:
                            chunk_text = str(getattr(chunk, 'message'))

                    # 4) Fallback to string representation
                    else:
                        try:
                            chunk_text = str(chunk)
                        except Exception:
                            chunk_text = None

                    if chunk_text:
                        # Server-Sent Events format — send 'text' key so front-end
                        # will render it in the chat bubble.
                        yield f"data: {json.dumps({'text': chunk_text})}\n\n"

                yield "data: [DONE]\n\n"

            except Exception as e:
                # Send the error as 'text' so the frontend can show it to the user
                # instead of silently ignoring it because it only looks for data.text
                err_text = f"Error from chat backend: {str(e)}"
                yield f"data: {json.dumps({'text': err_text})}\n\n"

        return StreamingHttpResponse(event_stream(), content_type='text/event-stream')

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
