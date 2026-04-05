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
    email: string;
    avatar: string;
    bio: string;
    postsCount: number;
    posts?: Post[];
    pseudo?: string;
    encryptedSecretCode?: string;
    hashedPassword?: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

export interface RegisterData {
    name: string;
    pseudo: string;
    secretCode: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginData {
    email: string;
    pseudo: string;
    secretCode: string;
    password: string;
}

const avatars = ["Felix", "Aneka", "Milo", "Luna", "Sophie"];
export const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
