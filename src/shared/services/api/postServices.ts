import { Post } from "../../types";
import supabase from "../database/supabase/info";



export const api = {
  // Posts
  async getAllPosts(options: {page: number, limit: number, sort?: 'recent' | 'popular'}): Promise<{posts: Post[], hasMore: boolean}> {
    let query = supabase.from("posts").select('*', {count: 'exact'});
    
    // Apply sorting
    if (options.sort === 'popular') {
      query = query.order('likes', {ascending: false});
    } else {
      query = query.order('created_at', {ascending: false});
    }
    
    const {data, count} = await query.range((options.page - 1) * options.limit, options.page * options.limit - 1);
    const posts = (data || []).map(post => ({
      ...post,
      createdAt: post.created_at
    }));
    return {
      posts,
      hasMore: count !== null && count > options.page * options.limit
    };
  },

  async getPost(id: string): Promise<Post | null> {
    try {
      const {data, error} = await supabase.from("posts").select("*").eq("id", id).single();
      if (error) throw error;
      return data ? {
        ...data,
        createdAt: data.created_at
      } : null;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  },

  async getPostsByCategory(category: string): Promise<Post[]> {
    const {data} = await supabase.from("posts").select("*").eq("category", category);
    return (data || []).map(post => ({
      ...post,
      createdAt: post.created_at
    }));
  },

  async createPost(post: {
    title: string;
    content: string;
    category: string;
    authorName: string;
    image?: string;
  }): Promise<Post> {
    const {data, error} = await supabase.from("posts").insert([{
      title: post.title,
      content: post.content,
      category: post.category,
      author: { name: post.authorName, avatar: '' },
      image: post.image,
      excerpt: post.content.substring(0, 150) + '...',
      likes: 0,
      comments: 0,
      views: 0,
      created_at: new Date()
    }]).select().single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create post: No data returned');
    return {
      ...data,
      createdAt: data.created_at
    };
  },

  async likePost(postId: string, _userId: string): Promise<Post> {
    const {error} = await supabase.rpc('increment_likes', { post_id: postId });
    if (error) throw error;
    
    const {data: updatedPost} = await supabase.from("posts").select("*").eq("id", postId).single();
    if (!updatedPost) throw new Error('Failed to update post: No data returned');
    return {
      ...updatedPost,
      createdAt: updatedPost.created_at
    };
  },

  async incrementViews(postId: string): Promise<void> {
    const {error} = await supabase.rpc('increment_views', { post_id: postId });
    if (error) throw error;
  },

  // Comments
  async getComments(postId: string): Promise<any[]> {
    const {data} = await supabase.from("comments").select("*").eq("post_id", postId);
    return data || [];
  },

  async addComment(postId: string, content: string, authorName: string): Promise<any> {
    const {data, error} = await supabase.from("comments").insert([{
      post_id: postId,
      content,
      author_name: authorName,
      created_at: new Date()
    }]).select().single();
    
    if (error) throw error;
    return data ? {
      ...data,
      createdAt: data.created_at
    } : null;
  },
};
