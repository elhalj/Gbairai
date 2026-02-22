"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const logger_1 = require("hono/logger");
const supabase_js_1 = require("@supabase/supabase-js");
const kv = require("./kv_store");
const app = new hono_1.Hono();
exports.app = app;
// Middleware
app.use('*', (0, cors_1.cors)());
app.use('*', (0, logger_1.logger)(console.log));
// Initialiser Supabase
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
// Créer le bucket pour les images au démarrage
async function initializeStorage() {
    const bucketName = 'make-462e692b-gbairai-images';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
        const { error } = await supabase.storage.createBucket(bucketName, {
            public: false,
            fileSizeLimit: 10485760 // 10MB
        });
        if (error)
            console.log('Bucket creation error:', error);
        else
            console.log('Bucket created successfully');
    }
}
initializeStorage();
// Routes
// Obtenir tous les posts
app.get('/make-server-462e692b/posts', async (c) => {
    try {
        const posts = await kv.getByPrefix('post:');
        const sortedPosts = posts.sort((a, b) => new Date(b.value.createdAt).getTime() - new Date(a.value.createdAt).getTime());
        return c.json({ success: true, posts: sortedPosts.map(p => p.value) });
    }
    catch (error) {
        console.log('Error fetching posts:', error);
        return c.json({ success: false, error: 'Failed to fetch posts' }, 500);
    }
});
// Obtenir un post par ID
app.get('/make-server-462e692b/posts/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const post = await kv.get(`post:${id}`);
        if (!post) {
            return c.json({ success: false, error: 'Post not found' }, 404);
        }
        return c.json({ success: true, post });
    }
    catch (error) {
        console.log('Error fetching post:', error);
        return c.json({ success: false, error: 'Failed to fetch post' }, 500);
    }
});
// Obtenir les posts par catégorie
app.get('/make-server-462e692b/posts/category/:category', async (c) => {
    try {
        const category = c.req.param('category');
        const allPosts = await kv.getByPrefix('post:');
        const categoryPosts = allPosts
            .filter(p => p.value.category === category)
            .sort((a, b) => new Date(b.value.createdAt).getTime() - new Date(a.value.createdAt).getTime());
        return c.json({ success: true, posts: categoryPosts.map(p => p.value) });
    }
    catch (error) {
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
        const postId = crypto.randomUUID();
        const now = new Date().toISOString();
        let imageUrl = null;
        // Upload image si fournie
        if (image && image.startsWith('data:image')) {
            const bucketName = 'make-462e692b-gbairai-images';
            const base64Data = image.split(',')[1];
            const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
            const fileName = `${postId}-${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(fileName, buffer, {
                contentType: 'image/jpeg',
                upsert: false
            });
            if (!uploadError) {
                const { data: signedUrlData } = await supabase.storage
                    .from(bucketName)
                    .createSignedUrl(fileName, 31536000); // 1 an
                imageUrl = signedUrlData?.signedUrl || null;
            }
        }
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
            image: imageUrl,
            createdAt: now,
            likes: 0,
            comments: 0,
            views: 0,
            likedBy: []
        };
        await kv.set(`post:${postId}`, post);
        return c.json({ success: true, post });
    }
    catch (error) {
        console.log('Error creating post:', error);
        return c.json({ success: false, error: 'Failed to create post' }, 500);
    }
});
// Liker un post
app.post('/make-server-462e692b/posts/:id/like', async (c) => {
    try {
        const id = c.req.param('id');
        const { userId } = await c.req.json();
        const post = await kv.get(`post:${id}`);
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
        await kv.set(`post:${id}`, updatedPost);
        return c.json({ success: true, post: updatedPost });
    }
    catch (error) {
        console.log('Error liking post:', error);
        return c.json({ success: false, error: 'Failed to like post' }, 500);
    }
});
// Obtenir les commentaires d'un post
app.get('/make-server-462e692b/posts/:id/comments', async (c) => {
    try {
        const id = c.req.param('id');
        const comments = await kv.getByPrefix(`comment:${id}:`);
        const sortedComments = comments.sort((a, b) => new Date(b.value.createdAt).getTime() - new Date(a.value.createdAt).getTime());
        return c.json({ success: true, comments: sortedComments.map(c => c.value) });
    }
    catch (error) {
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
        const commentId = crypto.randomUUID();
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
        await kv.set(`comment:${postId}:${commentId}`, comment);
        // Incrémenter le compteur de commentaires du post
        const post = await kv.get(`post:${postId}`);
        if (post) {
            await kv.set(`post:${postId}`, { ...post, comments: post.comments + 1 });
        }
        return c.json({ success: true, comment });
    }
    catch (error) {
        console.log('Error adding comment:', error);
        return c.json({ success: false, error: 'Failed to add comment' }, 500);
    }
});
// Incrémenter les vues d'un post
app.post('/make-server-462e692b/posts/:id/view', async (c) => {
    try {
        const id = c.req.param('id');
        const post = await kv.get(`post:${id}`);
        if (!post) {
            return c.json({ success: false, error: 'Post not found' }, 404);
        }
        const updatedPost = { ...post, views: post.views + 1 };
        await kv.set(`post:${id}`, updatedPost);
        return c.json({ success: true, post: updatedPost });
    }
    catch (error) {
        console.log('Error incrementing views:', error);
        return c.json({ success: false, error: 'Failed to increment views' }, 500);
    }
});
