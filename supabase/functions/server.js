const { Hono } = require('hono');
const { cors } = require('hono/cors');
const { logger } = require('hono/logger');
const { createClient } = require('@supabase/supabase-js');

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialiser Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://mindpshqgsysshrsgolw.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbmRwc2hxZ3N5c3NocnNnb2x3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTc2NzIyMSwiZXhwIjoyMDg3MzQzMjIxfQ.pVlLzYfMqQhF1JY_G0V6tGnqkq3sY2m_QJjHQlLdXHA'
);

// Simple in-memory storage for testing
const memoryStore = new Map();

// Helper functions for memory storage
const set = async (key, value) => {
  memoryStore.set(key, value);
};

const get = async (key) => {
  return memoryStore.get(key);
};

const getByPrefix = async (prefix) => {
  const results = [];
  for (const [key, value] of memoryStore.entries()) {
    if (key.startsWith(prefix)) {
      results.push({ key, value });
    }
  }
  return results;
};

// Routes

// Obtenir tous les posts
app.get('/make-server-462e692b/posts', async (c) => {
  try {
    const posts = await getByPrefix('post:');
    const sortedPosts = posts.sort((a, b) => 
      new Date(b.value.createdAt).getTime() - new Date(a.value.createdAt).getTime()
    );
    return c.json({ success: true, posts: sortedPosts.map(p => p.value) });
  } catch (error) {
    console.log('Error fetching posts:', error);
    return c.json({ success: false, error: 'Failed to fetch posts' }, 500);
  }
});

// Obtenir un post par ID
app.get('/make-server-462e692b/posts/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const post = await get(`post:${id}`);
    
    if (!post) {
      return c.json({ success: false, error: 'Post not found' }, 404);
    }
    
    return c.json({ success: true, post });
  } catch (error) {
    console.log('Error fetching post:', error);
    return c.json({ success: false, error: 'Failed to fetch post' }, 500);
  }
});

// Obtenir les posts par catégorie
app.get('/make-server-462e692b/posts/category/:category', async (c) => {
  try {
    const category = c.req.param('category');
    const allPosts = await getByPrefix('post:');
    const categoryPosts = allPosts
      .filter(p => p.value.category === category)
      .sort((a, b) => 
        new Date(b.value.createdAt).getTime() - new Date(a.value.createdAt).getTime()
      );
    
    return c.json({ success: true, posts: categoryPosts.map(p => p.value) });
  } catch (error) {
    console.log('Error fetching category posts:', error);
    return c.json({ success: false, error: 'Failed to fetch category posts' }, 500);
  }
});

// Créer un nouveau post
app.post('/make-server-462e692b/posts', async (c) => {
  try {
    const body = await c.req.json();
    const { title, content, category, authorName, image } = body;
    
    if (!title || !content || !category || !authorName) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }
    
    const postId = require('crypto').randomUUID();
    const now = new Date().toISOString();
    
    const post = {
      id: postId,
      title,
      content,
      excerpt: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
      category,
      author: {
        name: authorName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`
      },
      image: image || null,
      createdAt: now,
      likes: 0,
      comments: 0,
      views: 0,
      likedBy: []
    };
    
    await set(`post:${postId}`, post);
    
    return c.json({ success: true, post });
  } catch (error) {
    console.log('Error creating post:', error);
    return c.json({ success: false, error: 'Failed to create post' }, 500);
  }
});

// Liker un post
app.post('/make-server-462e692b/posts/:id/like', async (c) => {
  try {
    const id = c.req.param('id');
    const { userId } = await c.req.json();
    
    const post = await get(`post:${id}`);
    if (!post) {
      return c.json({ success: false, error: 'Post not found' }, 404);
    }
    
    const likedBy = post.likedBy || [];
    const hasLiked = likedBy.includes(userId);
    
    const updatedPost = {
      ...post,
      likes: hasLiked ? post.likes - 1 : post.likes + 1,
      likedBy: hasLiked 
        ? likedBy.filter((id) => id !== userId)
        : [...likedBy, userId]
    };
    
    await set(`post:${id}`, updatedPost);
    
    return c.json({ success: true, post: updatedPost });
  } catch (error) {
    console.log('Error liking post:', error);
    return c.json({ success: false, error: 'Failed to like post' }, 500);
  }
});

// Obtenir les commentaires d'un post
app.get('/make-server-462e692b/posts/:id/comments', async (c) => {
  try {
    const id = c.req.param('id');
    const comments = await getByPrefix(`comment:${id}:`);
    const sortedComments = comments.sort((a, b) => 
      new Date(b.value.createdAt).getTime() - new Date(a.value.createdAt).getTime()
    );
    
    return c.json({ success: true, comments: sortedComments.map(c => c.value) });
  } catch (error) {
    console.log('Error fetching comments:', error);
    return c.json({ success: false, error: 'Failed to fetch comments' }, 500);
  }
});

// Ajouter un commentaire
app.post('/make-server-462e692b/posts/:id/comments', async (c) => {
  try {
    const postId = c.req.param('id');
    const { content, authorName } = await c.req.json();
    
    if (!content || !authorName) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }
    
    const commentId = require('crypto').randomUUID();
    const now = new Date().toISOString();
    
    const comment = {
      id: commentId,
      postId,
      content,
      author: {
        name: authorName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`
      },
      createdAt: now
    };
    
    await set(`comment:${postId}:${commentId}`, comment);
    
    // Incrémenter le compteur de commentaires du post
    const post = await get(`post:${postId}`);
    if (post) {
      await set(`post:${postId}`, { ...post, comments: post.comments + 1 });
    }
    
    return c.json({ success: true, comment });
  } catch (error) {
    console.log('Error adding comment:', error);
    return c.json({ success: false, error: 'Failed to add comment' }, 500);
  }
});

// Incrémenter les vues d'un post
app.post('/make-server-462e692b/posts/:id/view', async (c) => {
  try {
    const id = c.req.param('id');
    const post = await get(`post:${id}`);
    
    if (!post) {
      return c.json({ success: false, error: 'Post not found' }, 404);
    }
    
    const updatedPost = { ...post, views: post.views + 1 };
    await set(`post:${id}`, updatedPost);
    
    return c.json({ success: true, post: updatedPost });
  } catch (error) {
    console.log('Error incrementing views:', error);
    return c.json({ success: false, error: 'Failed to increment views' }, 500);
  }
});

module.exports = { app };
