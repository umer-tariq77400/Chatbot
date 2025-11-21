from django.shortcuts import render
from .data import PORTFOLIO_CONTEXT, PROJECTS, BLOG_POSTS

def home(request):
    context = {
        "portfolio_context": PORTFOLIO_CONTEXT,
        "featured_projects": PROJECTS[:3]
    }
    return render(request, 'portfolio/home.html', context)

def projects(request):
    context = {
        "portfolio_context": PORTFOLIO_CONTEXT,
        "projects": PROJECTS
    }
    return render(request, 'portfolio/projects.html', context)

def project_detail(request, pk):
    project = next((p for p in PROJECTS if p["id"] == str(pk)), None)
    # ideally handle 404 here if not found
    context = {
        "portfolio_context": PORTFOLIO_CONTEXT,
        "project": project
    }
    return render(request, 'portfolio/project_detail.html', context)

def blog(request):
    context = {
        "portfolio_context": PORTFOLIO_CONTEXT,
        "posts": BLOG_POSTS
    }
    return render(request, 'portfolio/blog.html', context)

def blog_detail(request, pk):
    post = next((p for p in BLOG_POSTS if p["id"] == str(pk)), None)
    # ideally handle 404 here if not found
    context = {
        "portfolio_context": PORTFOLIO_CONTEXT,
        "post": post
    }
    return render(request, 'portfolio/blog_detail.html', context)
