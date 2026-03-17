export type Category =
    | "sports"
    | "communauté"
    | "école"
    | "politique"
    | "technologie"
    | "actualité";

export interface Post {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    category: Category;
    author: {
        name: string;
        avatar: string;
    };
    image?: string;
    createdAt: Date;
    likes: number;
    comments: number;
    views: number;
}

export interface User {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    postsCount: number;
}
