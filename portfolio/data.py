
OWNER_NAME = "Alex Dev"

PROJECTS = [
  {
    "id": "1",
    "title": "NeonCommerce Dashboard",
    "description": "A high-performance analytics dashboard for e-commerce platforms using React and D3.",
    "fullDescription": "NeonCommerce is a comprehensive analytics solution designed for modern e-commerce stores. It leverages the power of React 18's concurrent features to handle real-time data updates without UI lag. The visualization layer is built with D3.js, offering interactive heatmaps, line charts, and sales funnels. The backend utilizes Node.js and GraphQL to aggregate data from multiple sources efficiently.",
    "tags": ["React", "D3.js", "GraphQL", "TypeScript"],
    "imageUrl": "https://picsum.photos/800/600?random=1",
    "demoUrl": "#",
    "repoUrl": "#"
  },
  {
    "id": "2",
    "title": "SynthWave AI",
    "description": "An AI-powered image generation tool integrating multiple generative models.",
    "fullDescription": "SynthWave AI acts as a unified interface for various generative AI models. It features a prompt engineering assistant powered by Gemini to help users refine their creative intent. The application features a drag-and-drop canvas for image composition and uses WebSockets for real-time generation status updates.",
    "tags": ["Next.js", "Gemini API", "WebSockets", "Tailwind"],
    "imageUrl": "https://picsum.photos/800/600?random=2",
    "demoUrl": "#",
    "repoUrl": "#"
  },
  {
    "id": "3",
    "title": "TaskFlow Pro",
    "description": "Collaborative project management tool with real-time updates.",
    "fullDescription": "TaskFlow Pro enables remote teams to collaborate seamlessly. It features Kanban boards, Gantt charts, and integrated video calling. The state management is handled by Zustand for simplicity and performance, and it uses Firebase for real-time data synchronization across clients.",
    "tags": ["React", "Firebase", "Zustand", "WebRTC"],
    "imageUrl": "https://picsum.photos/800/600?random=3",
    "demoUrl": "#",
    "repoUrl": "#"
  }
]

BLOG_POSTS = [
  {
    "id": "1",
    "title": "Mastering React 18 Concurrency",
    "excerpt": "A deep dive into Suspense, Transitions, and how to build smoother UIs.",
    "content": "React 18 introduced a new concurrency model that fundamentally changes how React renders. In this post, we explore the `useTransition` hook and how it allows us to mark UI updates as non-urgent, keeping the interface responsive even during heavy computational tasks. We also look at how Suspense boundaries can be used for data fetching...",
    "date": "Oct 15, 2023",
    "readTime": "5 min read",
    "imageUrl": "https://picsum.photos/800/400?random=4"
  },
  {
    "id": "2",
    "title": "Why Tailwind CSS Won",
    "excerpt": "Utility-first CSS isn't just a trend; it's a paradigm shift in maintainability.",
    "content": "For years, semantic class names were the gold standard. Then came Tailwind. By co-locating styles with markup, we reduce context switching and dead code. This article analyzes the developer experience benefits of Tailwind, specifically regarding large-scale applications where CSS specificity wars often slow down development velocity...",
    "date": "Nov 02, 2023",
    "readTime": "4 min read",
    "imageUrl": "https://picsum.photos/800/400?random=5"
  },
  {
    "id": "3",
    "title": "The Future of AI on the Web",
    "excerpt": "Integrating LLMs like Gemini directly into frontend applications.",
    "content": "With APIs like Google's Gemini, frontend developers now have access to powerful reasoning capabilities directly in the browser context (or via lightweight proxies). We discuss how to implement RAG (Retrieval-Augmented Generation) on the client side for personalized user experiences and the implications for web accessibility...",
    "date": "Dec 10, 2023",
    "readTime": "6 min read",
    "imageUrl": "https://picsum.photos/800/400?random=6"
  }
]

PORTFOLIO_CONTEXT = {
  "owner": OWNER_NAME,
  "role": "Senior Frontend React Engineer",
  "bio": "I build accessible, pixel-perfect, and performant web experiences. Passionate about the intersection of design systems and AI.",
  "skills": ["React", "TypeScript", "Node.js", "Gemini API", "Tailwind CSS", "Three.js"],
  "projects": PROJECTS,
  "blog": BLOG_POSTS,
  "contact": {
    "email": "alex@example.com",
    "github": "github.com/alexdev",
    "linkedin": "linkedin.com/in/alexdev"
  }
}
