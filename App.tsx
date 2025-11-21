import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Code2, Terminal, BookOpen, Github, Linkedin, Mail, ExternalLink, ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';
import { PROJECTS, BLOG_POSTS, PORTFOLIO_CONTEXT } from './constants';
import ChatWidget from './components/ChatWidget';
import { Project, BlogPost } from './types';

// Helper components for the layout
const Navbar = () => {
  const location = useLocation();
  
  const navLinkClass = (path: string) => 
    `text-sm font-medium transition-colors ${
      location.pathname === path 
        ? 'text-indigo-600' 
        : 'text-slate-600 hover:text-indigo-600'
    }`;

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Code2 size={20} />
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">{PORTFOLIO_CONTEXT.owner}</span>
          </Link>
          
          <div className="flex gap-8">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/projects" className={navLinkClass('/projects')}>Projects</Link>
            <Link to="/blog" className={navLinkClass('/blog')}>Blog</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="text-slate-100 font-semibold text-lg mb-2">{PORTFOLIO_CONTEXT.owner}</p>
          <p className="text-sm max-w-xs">{PORTFOLIO_CONTEXT.bio}</p>
        </div>
        <div className="flex gap-6">
          <a href={`https://${PORTFOLIO_CONTEXT.contact.github}`} className="hover:text-white transition-colors"><Github size={20} /></a>
          <a href={`https://${PORTFOLIO_CONTEXT.contact.linkedin}`} className="hover:text-white transition-colors"><Linkedin size={20} /></a>
          <a href={`mailto:${PORTFOLIO_CONTEXT.contact.email}`} className="hover:text-white transition-colors"><Mail size={20} /></a>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} {PORTFOLIO_CONTEXT.owner}. All rights reserved. Built with React, Tailwind & Gemini.</p>
      </div>
    </div>
  </footer>
);

// Page Components
const HomePage = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-6">
              <Sparkles size={12} />
              <span>Available for hire</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
              Building digital <br/>
              <span className="text-indigo-600">experiences</span> that matter.
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
              I'm a {PORTFOLIO_CONTEXT.role} specializing in modern web technologies. 
              I combine technical expertise with a keen eye for design to create performant and accessible applications.
            </p>
            <div className="flex gap-4">
              <Link to="/projects" className="px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2">
                View Work <ChevronRight size={16} />
              </Link>
              <Link to="/blog" className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                Read Blog
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -z-10 opacity-10 translate-x-1/3 -translate-y-1/4">
           <svg width="800" height="800" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4F46E5" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.9C87.4,-34.7,90.1,-20.4,89.1,-6.5C88.1,7.4,83.4,20.8,75.4,32.1C67.4,43.4,56.1,52.6,44.1,60.5C32,68.4,19.2,75,-5.6,84.7C-30.4,94.4,-67.2,107.2,-84.1,94.9C-101,82.6,-98,45.2,-91.3,16.2C-84.6,-12.8,-74.2,-33.4,-61.7,-49.9C-49.2,-66.4,-34.6,-78.8,-19.7,-78.3C-4.8,-77.8,10.4,-64.4,25.6,-51" transform="translate(100 100)" />
          </svg>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Projects</h2>
                <p className="text-slate-500">A selection of my recent work</p>
            </div>
            <Link to="/projects" className="hidden md:flex items-center text-indigo-600 font-medium hover:text-indigo-700">
                View all <ChevronRight size={16} />
            </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROJECTS.slice(0, 3).map((project) => (
             <Link key={project.id} to={`/projects/${project.id}`} className="group block">
                <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden mb-4">
                    <img src={project.imageUrl} alt={project.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
                <p className="text-slate-600 line-clamp-2 text-sm">{project.description}</p>
             </Link>
          ))}
        </div>
        <div className="mt-8 md:hidden">
             <Link to="/projects" className="flex items-center text-indigo-600 font-medium hover:text-indigo-700">
                View all <ChevronRight size={16} />
            </Link>
        </div>
      </section>
    </div>
  );
};

const ProjectsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Projects</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          From web applications to experimental AI interfaces, here is a collection of things I've built.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {PROJECTS.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300 overflow-hidden flex flex-col h-full">
            <div className="aspect-[16/9] overflow-hidden bg-slate-100 relative">
                <img src={project.imageUrl} alt={project.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition-colors duration-300" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{tag}</span>
                    ))}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{project.title}</h2>
                <p className="text-slate-600 mb-6 flex-1">{project.description}</p>
                <div className="flex items-center text-indigo-600 font-medium text-sm mt-auto">
                    View Details <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const ProjectDetailPage = () => {
    const location = useLocation();
    const id = location.pathname.split('/').pop();
    const project = PROJECTS.find(p => p.id === id);

    if (!project) return <Navigate to="/projects" />;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/projects" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Projects
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{project.title}</h1>
            
            <div className="flex flex-wrap gap-3 mb-8">
                 {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 font-medium rounded-full text-sm">{tag}</span>
                ))}
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-100 mb-10 border border-slate-200 shadow-sm">
                <img src={project.imageUrl} alt={project.title} className="w-full h-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 prose prose-lg prose-slate text-slate-600">
                    <p className="lead text-xl">{project.description}</p>
                    <div className="mt-6">
                        <h3 className="text-slate-900 font-bold text-xl mb-3">About the Project</h3>
                        <p>{project.fullDescription}</p>
                    </div>
                </div>
                <div className="space-y-6">
                     <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-4">Links</h3>
                        <div className="space-y-3">
                            {project.demoUrl && (
                                <a href={project.demoUrl} className="flex items-center justify-between px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                                    <span>Live Demo</span>
                                    <ExternalLink size={16} />
                                </a>
                            )}
                            {project.repoUrl && (
                                <a href={project.repoUrl} className="flex items-center justify-between px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                                    <span>Source Code</span>
                                    <Github size={16} />
                                </a>
                            )}
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

const BlogPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Blog</h1>
            <p className="text-slate-600">Thoughts on engineering, design, and the future of the web.</p>
        </div>

        <div className="space-y-12">
            {BLOG_POSTS.map((post) => (
                <article key={post.id} className="group flex flex-col md:flex-row gap-8 items-start">
                     <div className="w-full md:w-1/3 aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                        </div>
                        <Link to={`/blog/${post.id}`}>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{post.title}</h2>
                        </Link>
                        <p className="text-slate-600 mb-4 leading-relaxed">{post.excerpt}</p>
                        <Link to={`/blog/${post.id}`} className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700 text-sm">
                            Read Article <ChevronRight size={16} className="ml-1" />
                        </Link>
                     </div>
                </article>
            ))}
        </div>
    </div>
  );
};

const BlogDetailPage = () => {
    const location = useLocation();
    const id = location.pathname.split('/').pop();
    const post = BLOG_POSTS.find(p => p.id === id);

    if (!post) return <Navigate to="/blog" />;

    return (
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/blog" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Blog
            </Link>

            <header className="mb-10">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-500 mb-4">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">{post.title}</h1>
                <div className="aspect-video w-full bg-slate-100 rounded-2xl overflow-hidden">
                     <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                </div>
            </header>

            <div className="prose prose-lg prose-slate prose-headings:text-slate-900 prose-a:text-indigo-600">
                <p className="lead">{post.excerpt}</p>
                {/* Simulating rich text content rendering */}
                {post.content.split('\n').map((paragraph, idx) => (
                    paragraph ? <p key={idx}>{paragraph}</p> : <br key={idx}/>
                ))}
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <h3>The Technical Details</h3>
                <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>
        </article>
    );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </HashRouter>
  );
};

export default App;