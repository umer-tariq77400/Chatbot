# Chatbot Documentation

## Overview

The chatbot is an AI assistant embedded in the portfolio to answer questions about the owner's skills, projects, and experience. It is powered by Google's Gemini model.

## How it Works

1.  **User Interface**:
    - A floating chat widget is included in the base template.
    - It is built with vanilla JavaScript (`chatbot/static/chatbot/js/chat.js`).
    - It handles opening/closing the window, sending messages, and displaying responses.

2.  **Data Flow**:
    - When a user sends a message, the JS makes a `POST` request to `/api/chat/message/`.
    - The backend view `chatbot.views.chat_message` receives the prompt.
    - The backend initializes the Google GenAI client using the `API_KEY` from environment variables.

3.  **Context Injection**:
    - The system instruction is defined in `chatbot/utils.py`.
    - It injects the entire `PORTFOLIO_CONTEXT` (JSON dump of projects, bio, skills) into the system prompt.
    - This allows the AI to answer specific questions like "What tech stack was used in NeonCommerce?" based on the actual data in `portfolio/data.py`.

4.  **Streaming Responses**:
    - The backend uses `client.chats.create()` and `send_message_stream()` to generate responses.
    - The Django view returns a `StreamingHttpResponse` using Server-Sent Events (SSE) format (`data: {...}`).
    - The frontend JavaScript reads the stream and updates the UI in real-time, providing a smooth user experience.
