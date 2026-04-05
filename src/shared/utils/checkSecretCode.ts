import { Post } from "../types";

export const checkSecretCodeInPosts = (secretCode: string, posts?: Post[]): boolean => {
    // Si les posts sont fournis, les utiliser, sinon utiliser localStorage
    const postsToCheck = posts || JSON.parse(localStorage.getItem("posts") || "[]");
    return postsToCheck.some(
        (post: any) =>
            (post.content && post.content.includes(secretCode)) ||
            (post.title && post.title.includes(secretCode)),
    );
};

export const getPostsWithSecretCode = (secretCode: string, allPosts: Post[]): Post[] => {
    if (!secretCode) return [];
    
    return allPosts.filter(
        (post: any) =>
            (post.content && post.content.includes(secretCode)) ||
            (post.title && post.title.includes(secretCode)) ||
            (post.excerpt && post.excerpt.includes(secretCode))
    );
};
