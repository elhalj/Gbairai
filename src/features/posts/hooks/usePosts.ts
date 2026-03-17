import { useQuery, useQueryClient, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { api } from '../../../shared/services/api/postServices';

export function usePosts(options?: {page: number, limit: number, sort?: 'recent' | 'popular'}) {
    const queryClient = useQueryClient();

    const getAllPosts = useQuery({
        queryKey: ["posts", options],
        queryFn: () => api.getAllPosts(options || {page: 1, limit: 10})
    });

    const getPost = (id: string) => useQuery({
        queryKey: ["post", id],
        queryFn: () => api.getPost(id),
        enabled: !!id
    });

    const getPostsByCategory = (category: string) => useQuery({
        queryKey: ["posts", "category", category],
        queryFn: () => api.getPostsByCategory(category),
        enabled: !!category
    });

    const createPostMutation = useMutation({
        mutationFn: (post: {
            title: string;
            content: string;
            category: string;
            authorName: string;
            image?: string;
        }) => api.createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
    });

    const likePostMutation = useMutation({
        mutationFn: ({ postId, userId }: { postId: string; userId: string }) => 
            api.likePost(postId, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
        }
    });

    const incrementViewsMutation = useMutation({
        mutationFn: (postId: string) => api.incrementViews(postId),
        onSuccess: (_, postId) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
        }
    });

    const getComments = (postId: string) => useQuery({
        queryKey: ["comments", postId],
        queryFn: () => api.getComments(postId),
        enabled: !!postId
    });

    const addCommentMutation = useMutation({
        mutationFn: ({ postId, content, authorName }: { 
            postId: string; 
            content: string; 
            authorName: string 
        }) => api.addComment(postId, content, authorName),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
        }
    });

    return {
        // Queries
        getAllPosts,
        getPost,
        getPostsByCategory,
        getComments,
        
        // Mutations
        createPost: createPostMutation,
        likePost: likePostMutation,
        incrementViews: incrementViewsMutation,
        addComment: addCommentMutation,
        
        // Query client
        queryClient
    };
}

// Hook pour le scroll infini
export function useInfinitePosts(sort?: 'recent' | 'popular') {
    const queryClient = useQueryClient();

    const getInfinitePosts = useInfiniteQuery({
        queryKey: ["posts", "infinite", sort],
        queryFn: ({ pageParam = 1 }) => api.getAllPosts({ 
            page: pageParam, 
            limit: 3, 
            sort: sort || 'recent' 
        }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.hasMore) {
                return allPages.length + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });

    const createPostMutation = useMutation({
        mutationFn: (post: {
            title: string;
            content: string;
            category: string;
            authorName: string;
            image?: string;
        }) => api.createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
    });

    const likePostMutation = useMutation({
        mutationFn: ({ postId, userId }: { postId: string; userId: string }) => 
            api.likePost(postId, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
        }
    });

    const incrementViewsMutation = useMutation({
        mutationFn: (postId: string) => api.incrementViews(postId),
        onSuccess: (_, postId) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
        }
    });

    // Aplatir toutes les pages en un seul tableau
    const posts = getInfinitePosts.data?.pages.flatMap(page => page.posts) || [];

    return {
        posts,
        getInfinitePosts,
        createPost: createPostMutation,
        likePost: likePostMutation,
        incrementViews: incrementViewsMutation,
        queryClient
    };
}