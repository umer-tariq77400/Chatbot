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
                    if chunk.text:
                        # Server-Sent Events format
                        yield f"data: {json.dumps({'text': chunk.text})}\n\n"

                yield "data: [DONE]\n\n"

            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"

        return StreamingHttpResponse(event_stream(), content_type='text/event-stream')

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
