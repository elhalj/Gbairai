import { useState, useEffect } from 'react';
import { PostCard } from '../components/PostCard';
import { api } from '../services/api';
import { Post } from '../types';
import { Flame, Loader2 } from 'lucide-react';

export function Trending() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await api.getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading trending posts:', error);
    } finally {
      setLoading(false);
    }
  };

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