import { useState, useEffect } from 'react';
import { Flame, Loader2 } from 'lucide-react';
import { usePosts } from '@/features/posts/hooks/usePosts';
import { PostCard } from '@/features/posts/components/PostCard';

export function Trending() {
  // Utiliser le hook usePosts pour récupérer les posts populaires
  const { getAllPosts } = usePosts({ page: 1, limit: 50, sort: 'popular' });

  // Pour la démo, filtrer par nom d'utilisateur ou afficher tous les posts
  const posts = getAllPosts.data?.posts || [];
  const loading = getAllPosts.isLoading;

  // Trier par likes pour afficher les tendances
  const trendingPosts = [...posts].sort((a, b) => b.likes - a.likes);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* En-tête */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Flame className="size-7 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Tendances
          </h1>
        </div>
        <p className="text-gray-600">
          Les articles les plus populaires du moment
        </p>
      </div>

      {/* Liste des posts tendance */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : trendingPosts.length > 0 ? (
        <div className="space-y-6">
          {trendingPosts.map((post, index) => (
            <div key={post.id} className="relative">
              {/* Numéro de classement */}
              <div className="absolute -left-8 top-8 hidden md:flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-700 rounded-full font-bold text-sm">
                {index + 1}
              </div>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun article tendance pour le moment</p>
        </div>
      )}
    </div>
  );
}