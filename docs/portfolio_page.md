# Portfolio Page Documentation

## Overview

The `portfolio` app is responsible for rendering the main public-facing pages of the website. It showcases the owner's projects, blog posts, and professional profile.

## Data Source

Data is currently stored statically in `portfolio/data.py` to mimic the original frontend-only structure. This file contains:
- `PORTFOLIO_CONTEXT`: General site metadata (Owner, Role, Bio, Contact info).
- `PROJECTS`: A list of project dictionaries.
- `BLOG_POSTS`: A list of blog post dictionaries.

## Views

The application defines the following views in `portfolio/views.py`:

### `home`
- **Route**: `/`
- **Template**: `portfolio/home.html`
- **Context**: Passes `portfolio_context` and the first 3 `featured_projects`.

### `projects`
- **Route**: `/projects/`
- **Template**: `portfolio/projects.html`
- **Context**: Lists all available projects.

### `project_detail`
- **Route**: `/projects/<id>/`
- **Template**: `portfolio/project_detail.html`
- **Logic**: Retrieves a specific project by ID from the static list.

### `blog`
- **Route**: `/blog/`
- **Template**: `portfolio/blog.html`
- **Context**: Lists all blog posts.

### `blog_detail`
- **Route**: `/blog/<id>/`
- **Template**: `portfolio/blog_detail.html`
- **Logic**: Retrieves a specific blog post by ID.

## Templates

Templates use **Django Template Language (DTL)** and extend a common base layout (`portfolio/base.html`).
- **Base Layout**: Includes the Navbar, Footer, and the Chat Widget (`{% include "chatbot/chat_widget.html" %}`).
- **Styling**: All styling is applied using Tailwind CSS classes directly in the HTML.
