import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Post } from '../types';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-462e692b`;

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

export const api = {
  // Posts
  async getAllPosts(): Promise<Post[]> {
    const data = await fetchAPI('/posts');
    return data.posts || [];
  },

  async getPost(id: string): Promise<Post | null> {
    try {
      const data = await fetchAPI(`/posts/${id}`);
      return data.post;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  },

  async getPostsByCategory(category: string): Promise<Post[]> {
    const data = await fetchAPI(`/posts/category/${category}`);
    return data.posts || [];
  },

  async createPost(post: {
    title: string;
    content: string;
    category: string;
    authorName: string;
    image?: string;
  }): Promise<Post> {
    const data = await fetchAPI('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
    return data.post;
  },

  async likePost(postId: string, userId: string): Promise<Post> {
    const data = await fetchAPI(`/posts/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    return data.post;
  },

  async incrementViews(postId: string): Promise<void> {
    await fetchAPI(`/posts/${postId}/view`, {
      method: 'POST',
    });
  },

  // Comments
  async getComments(postId: string): Promise<any[]> {
    const data = await fetchAPI(`/posts/${postId}/comments`);
    return data.comments || [];
  },

  async addComment(postId: string, content: string, authorName: string): Promise<any> {
    const data = await fetchAPI(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, authorName }),
    });
    return data.comment;
  },
};
