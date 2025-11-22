# Architecture Documentation

## Overview

This project is a personal portfolio website built with **Django**, featuring an AI-powered chatbot integrated via the **Google GenAI SDK**. The application was originally a React/TypeScript SPA and has been migrated to a server-side rendered Django application using Django Templates (DTL).

## Project Structure

The project follows a standard Django layout with two main applications:

- **`portfolio`**: Handles the core pages (Home, Projects, Blog) and data presentation.
- **`chatbot`**: Manages the AI chat interface and API communication.

```
chat_portfolio/
├── manage.py
├── chat_portfolio/      # Project settings and configuration
├── portfolio/           # Main app for pages
│   ├── data.py          # Static data source (projects, blog posts)
│   ├── views.py         # Page rendering logic
│   └── templates/       # DTL templates
└── chatbot/             # Chat feature app
    ├── utils.py         # Gemini API integration
    ├── views.py         # API endpoints for chat
    └── static/          # JS for chat widget
```

## Tech Stack

### Backend
- **Django 5.2**: The web framework.
- **Google GenAI SDK (`google-genai`)**: For interfacing with Gemini models.
- **Python 3.12**: Runtime environment.

### Frontend
- **Django Templates (DTL)**: For server-side rendering of HTML.
- **Tailwind CSS**: Utility-first CSS framework (loaded via CDN).
- **Lucide Icons**: Icon library (loaded via CDN).
- **Vanilla JavaScript**: Used for the chat widget interactivity.
- **Marked.js**: For rendering Markdown content in chat responses.

## Deployment

- **Environment Variables**: The application relies on an `API_KEY` for the Google GenAI service, which should be set in the environment (e.g., via `.env` file).
- **Static Files**: Standard Django static file collection is required for deployment.
