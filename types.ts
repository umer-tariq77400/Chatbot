export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  tags: string[];
  imageUrl: string;
  demoUrl?: string;
  repoUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  imageUrl: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum ViewState {
  HOME = 'HOME',
  PROJECTS = 'PROJECTS',
  PROJECT_DETAIL = 'PROJECT_DETAIL',
  BLOG = 'BLOG',
  BLOG_DETAIL = 'BLOG_DETAIL',
}