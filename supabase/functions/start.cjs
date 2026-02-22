#!/usr/bin/env node

// Simple HTTP server for testing
const http = require("http");

// In-memory storage
const memoryStore = new Map();

// Helper functions
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

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Request handler
const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  // Set CORS headers for all responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Parse URL
  const url = new URL(req.url, `http://localhost:3000`);
  const path = url.pathname;

  try {
    // GET /make-server-462e692b/posts
    if (req.method === "GET" && path === "/make-server-462e692b/posts") {
      const posts = await getByPrefix("post:");
      const sortedPosts = posts.sort(
        (a, b) =>
          new Date(b.value.createdAt).getTime() -
          new Date(a.value.createdAt).getTime(),
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          posts: sortedPosts.map((p) => p.value),
        }),
      );
      return;
    }

    // GET /make-server-462e692b/posts/:id
    if (
      req.method === "GET" &&
      path.startsWith("/make-server-462e692b/posts/")
    ) {
      const id = path.split("/")[3];
      const post = await get(`post:${id}`);

      if (!post) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Post not found" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, post }));
      return;
    }

    // GET /make-server-462e692b/posts/category/:category
    if (
      req.method === "GET" &&
      path.startsWith("/make-server-462e692b/posts/category/")
    ) {
      const category = path.split("/")[4];
      const allPosts = await getByPrefix("post:");
      const categoryPosts = allPosts
        .filter((p) => p.value.category === category)
        .sort(
          (a, b) =>
            new Date(b.value.createdAt).getTime() -
            new Date(a.value.createdAt).getTime(),
        );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          posts: categoryPosts.map((p) => p.value),
        }),
      );
      return;
    }

    // POST /make-server-462e692b/posts/:id/like
    if (
      req.method === "POST" &&
      path.startsWith("/make-server-462e692b/posts/") &&
      path.endsWith("/like")
    ) {
      const pathParts = path.split("/");
      const postId = pathParts[3];

      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        try {
          const { userId } = JSON.parse(body);
          const post = await get(`post:${postId}`);

          if (!post) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ success: false, error: "Post not found" }),
            );
            return;
          }

          const likedBy = post.likedBy || [];
          const hasLiked = likedBy.includes(userId);

          const updatedPost = {
            ...post,
            likes: hasLiked ? post.likes - 1 : post.likes + 1,
            likedBy: hasLiked
              ? likedBy.filter((id) => id !== userId)
              : [...likedBy, userId],
          };

          await set(`post:${postId}`, updatedPost);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, post: updatedPost }));
        } catch (error) {
          console.log("Error liking post:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ success: false, error: "Failed to like post" }),
          );
        }
      });
      return;
    }

    // POST /make-server-462e692b/posts/:id/view
    if (
      req.method === "POST" &&
      path.startsWith("/make-server-462e692b/posts/") &&
      path.endsWith("/view")
    ) {
      const pathParts = path.split("/");
      const postId = pathParts[3];

      const post = await get(`post:${postId}`);

      if (!post) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Post not found" }));
        return;
      }

      const updatedPost = { ...post, views: post.views + 1 };
      await set(`post:${postId}`, updatedPost);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, post: updatedPost }));
      return;
    }

    // GET /make-server-462e692b/posts/:id/comments
    if (
      req.method === "GET" &&
      path.startsWith("/make-server-462e692b/posts/") &&
      path.endsWith("/comments")
    ) {
      const pathParts = path.split("/");
      const postId = pathParts[3];

      const comments = await getByPrefix(`comment:${postId}:`);
      const sortedComments = comments.sort(
        (a, b) =>
          new Date(b.value.createdAt).getTime() -
          new Date(a.value.createdAt).getTime(),
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          comments: sortedComments.map((c) => c.value),
        }),
      );
      return;
    }

    // POST /make-server-462e692b/posts/:id/comments
    if (
      req.method === "POST" &&
      path.startsWith("/make-server-462e692b/posts/") &&
      pathParts[4] === "comments"
    ) {
      const pathParts = path.split("/");
      const postId = pathParts[3];

      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        try {
          const { content, authorName } = JSON.parse(body);

          if (!content || !authorName) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: false,
                error: "Missing required fields",
              }),
            );
            return;
          }

          const commentId = require("crypto").randomUUID();
          const now = new Date().toISOString();

          const comment = {
            id: commentId,
            postId,
            content,
            author: {
              name: authorName,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`,
            },
            createdAt: now,
          };

          await set(`comment:${postId}:${commentId}`, comment);

          // Incrémenter le compteur de commentaires du post
          const post = await get(`post:${postId}`);
          if (post) {
            await set(`post:${postId}`, {
              ...post,
              comments: post.comments + 1,
            });
          }

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, comment }));
        } catch (error) {
          console.log("Error adding comment:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ success: false, error: "Failed to add comment" }),
          );
        }
      });
      return;
    }
    if (req.method === "POST" && path === "/make-server-462e692b/posts") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        try {
          const { title, content, category, authorName, image } =
            JSON.parse(body);

          if (!title || !content || !category || !authorName) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: false,
                error: "Missing required fields",
              }),
            );
            return;
          }

          const postId = require("crypto").randomUUID();
          const now = new Date().toISOString();

          const post = {
            id: postId,
            title,
            content,
            excerpt:
              content.substring(0, 150) + (content.length > 150 ? "..." : ""),
            category,
            author: {
              name: authorName,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`,
            },
            image: image || null,
            createdAt: now,
            likes: 0,
            comments: 0,
            views: 0,
            likedBy: [],
          };

          await set(`post:${postId}`, post);

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, post }));
        } catch (error) {
          console.log("Error creating post:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ success: false, error: "Failed to create post" }),
          );
        }
      });
      return;
    }

    // 404 for other routes
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Not found" }));
  } catch (error) {
    console.log("Server error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Server error" }));
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
