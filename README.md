# Chat Portfolio

A modern, server-side rendered portfolio website built with Django, featuring a Generative AI chatbot powered by Google Gemini.

## Features

- **Portfolio Showcase**: Display projects and blog posts with detailed views.
- **AI Assistant**: A built-in chatbot that answers questions about the portfolio owner using context-aware AI.
- **Modern UI**: Styled with Tailwind CSS and Lucide Icons.
- **Streaming Chat**: Real-time typewriter effect for AI responses.

## Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd chat_portfolio
    ```

2.  **Install dependencies**:
    ```bash
    pip install django google-genai
    ```

3.  **Environment Configuration**:
    Create a `.env` file or export the `API_KEY` in your shell. This key is required for the chatbot to function.
    ```bash
    export API_KEY="your_google_genai_api_key"
    ```

4.  **Run Migrations**:
    ```bash
    python manage.py migrate
    ```

5.  **Start the Server**:
    ```bash
    python manage.py runserver
    ```

6.  **Visit**: `http://127.0.0.1:8000`

## Contribution

We welcome contributions! Please read the documentation in the `docs/` folder for architecture details.

- **Architecture**: `docs/architecture.md`
- **Portfolio Pages**: `docs/portfolio_page.md`
- **Chatbot Internals**: `docs/chatbot.md`

1.  Fork the repo.
2.  Create a feature branch.
3.  Submit a Pull Request.
