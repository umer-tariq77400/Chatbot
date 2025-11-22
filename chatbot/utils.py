import os
import json
from google import genai
from portfolio.data import PORTFOLIO_CONTEXT

# Initialize the client
# API_KEY is guaranteed to be in process.env.API_KEY per instructions
# In Django/Python, we access it via os.environ
api_key = os.environ.get('API_KEY')
# If API_KEY is missing (e.g. during tests), we might want to handle it gracefully
# or mock it. For now, we initialize client lazily or check if it's None.
if api_key:
    client = genai.Client(api_key=api_key)
else:
    # For tests or dev environment without key, we might leave it None or mock
    # But if we instantiate at module level, it crashes.
    # We can use a dummy key for tests or handle it inside functions.
    # However, `views.py` imports `client`.
    # Let's initialize with a dummy key if not found, but calls will fail.
    # Or better, check inside `send_message_to_gemini`.
    # But the current structure has `client` at module level.
    # Let's use a lazy initialization or just a dummy string if strictly checking for existence.
    client = genai.Client(api_key="dummy_key")

SYSTEM_INSTRUCTION = f"""
You are a helpful, professional, and friendly AI assistant for {PORTFOLIO_CONTEXT['owner']}'s personal portfolio website.
Your goal is to help visitors learn more about Alex, his projects, and his thoughts on technology.

Here is the data you have access to:
{json.dumps(PORTFOLIO_CONTEXT, indent=2)}

Guidelines:
1. Keep answers concise and engaging.
2. If asked about specific projects, use the details provided in the context.
3. If asked about technical skills, reference the skills list and how they are used in the projects.
4. If a user asks something outside the scope of a professional portfolio (e.g., "How do I bake a cake?"), politely steer the conversation back to Alex's work or technology, or provide a brief answer but link it back to creativity if possible.
5. Format your responses using Markdown (e.g., bold for emphasis, lists for readability).
"""

# Note: The python SDK for google-genai might behave differently regarding session persistence across requests.
# For a simple chatbot in Django without a database for sessions, we might just send the history or context each time,
# or rely on the client if it supports it.
# However, the `google-genai` package documentation suggests using `chats.create`.
# Since Django is stateless, `chatSession` global variable will only persist within the process, which might be reset.
# Ideally, we should store chat history in the session or database.
# BUT, to match the simple "in-memory" feel of the frontend version (which also loses state on refresh),
# we will implement a simple send message function.
# The frontend implementation seems to hold the state.
# The backend implementation here will receive the message.
# If we want to maintain context, the frontend should probably send the conversation history,
# or we just treat each message as a new query with the system instruction.
# The original code: `chatSession` is a module-level variable.
# In a production Django app (e.g. gunicorn workers), this won't work well for multiple users.
# But for this task, we can try to replicate it or just create a new chat for each request
# (which means no memory of previous turns unless we pass history).
# Given the constraints and "don't change design", the frontend holds the history visually.
# To keep it simple and robust for a stateless backend:
# We will create a new chat instance for each request, but maybe we can't easily keep history this way.
# However, the original `geminiService.ts` exported `getChatSession` which reused a global variable.
# This implies the original app (React) ran in the browser, so it was a single user session.
# Here, the backend serves multiple users. We CANNOT share `chatSession` globally.
# That would mean User A sees User B's context.
# So we MUST create a new chat session for each request OR store it in Django Session.
# For now, let's create a new generation for each message, effectively making it stateless on the backend side,
# or relies on the frontend to send context if it was more complex.
# But `chat.sendMessageStream` implies a stateful chat object.
# Let's try to use the stateless `models.generate_content` with system instruction,
# OR instantiate a chat object but we won't have previous history unless passed.
# Since the user didn't ask for a complex history feature, and the React app just held the object in memory,
# we will just generate a response to the current prompt using the system instruction.

def send_message_to_gemini(message_text):
    # Create a chat/generation request
    # We use the system instruction and the user message.
    # If we want streaming, we can yield chunks.

    # Using the new google-genai SDK style
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=message_text,
        config={
            'system_instruction': SYSTEM_INSTRUCTION,
            'temperature': 0.7,
        }
    )

    return response.text
