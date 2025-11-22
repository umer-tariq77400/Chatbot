## Repo overview

Small Django app with two main apps:
- `portfolio` — static, in-memory portfolio and blog pages (templates in `portfolio/templates/portfolio/` and data in `portfolio/data.py`).
- `chatbot` — a simple chat widget that proxies messages to Google's Generative AI SDK (uses `google-genai` via `chatbot/utils.py` and exposes `/api/chat/message/` in `chatbot/views.py`).

Why this matters: the site renders a static portfolio UI (no DB in use) while the chatbot connects to an external model via environment-provided API keys. Changes to the chat path, model name, or system prompt are the most common editing tasks.

## Quick dev workflows / commands
- Install dependencies: `pip install -r requirements.txt` (Python 3.10+ recommended for Django 5.2)
- Run migrations (DB exists but portfolio currently uses in-memory data):
  - `python manage.py migrate`
- Run dev server (default port used in verification):
  - `python manage.py runserver 127.0.0.1:8000`
- Run unit tests:
  - `python manage.py test`

Note: Chat endpoint expects an env var `API_KEY` containing the Google GenAI key. Tests in `portfolio/tests.py` don't require it; tests that call the SDK should mock `google.genai.Client`.

## Important files & patterns for AI agents
- System instruction and client configuration: `chatbot/utils.py`
  - Contains `SYSTEM_INSTRUCTION` and `client = genai.Client(api_key=...)`.
  - Replace or tune the `SYSTEM_INSTRUCTION` here for assistant behavior changes.
  - Model used in code: `gemini-2.5-flash` (both streaming and non-streaming code paths).
- Streaming and SSE behavior: `chatbot/views.py` + `chatbot/static/chatbot/js/chat.js`
  - `chat_message` returns a Django `StreamingHttpResponse` using Server-Sent Events (SSE) and the frontend reads the response with `response.body.getReader()`.
  - If you change the streaming format keep the SSE shape (lines like `data: {...}\n\n`) so `chat.js` parsing keeps working.
- Static in-memory dataset: `portfolio/data.py`
  - The site isn't wired to a persistent DB for projects/blogs — data is a Python dict/list. Editing `PORTFOLIO_CONTEXT` updates pages immediately in templates.
- Templates and UI: `portfolio/templates/portfolio/` and `chatbot/templates/chatbot/chat_widget.html`
  - Chat widget is included in `portfolio/templates/portfolio/base.html` and loads `chatbot/js/chat.js`.

## Tests & CI notes
- Existing unit tests live in `portfolio/tests.py`; they use Django's `TestCase` and `Client` to exercise views.
- The playbook verification script `verification/verify_portfolio.py` expects the site at `http://127.0.0.1:8000` and checks the UI + chat toggle — useful for end-to-end checks.
- When writing tests that exercise chat functionality, mock `google.genai.Client` or inject a fake `API_KEY` and a test double, because integration with the real GenAI API requires network/API access.

## Typical small tasks & where to implement them
- Add or change assistant behavior: update `SYSTEM_INSTRUCTION` in `chatbot/utils.py` or alter how `chat_message` builds chat sessions in `chatbot/views.py`.
- Support chat history: either a) accept `history` from the frontend and pass it into the SDK, or b) store per-user chat in Django sessions. Watch for server-worker memory sharing if using in-memory global variables.
- Change model / parameters: update model name or `temperature` in `chatbot/views.py` or `chatbot/utils.py`.

## Safety / environment assumptions
- Do not commit secret keys. The service expects `API_KEY` in the environment (or `.env` kept out of repo). The repo has an empty `.env` placeholder.
- Debug is enabled in `chat_portfolio/settings.py` — this is a development template, not production-ready.

If anything here looks off or you want shorter/longer guidance on testing or mocking the GenAI integration, tell me which part to expand. ✅
