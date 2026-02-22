import { useState, useEffect } from 'react';
import { PostCard } from '../components/PostCard';
import { api } from '../services/api';
import { Post } from '../types';
import { Button } from '../components/ui/button';
import { Filter, Loader2 } from 'lucide-react';

export function Home() {
  const [filter, setFilter] = useState<'recent' | 'popular'>('recent');
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
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (filter === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.likes - a.likes;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Fil d'actualité
        </h1>
        <p className="text-gray-600">
          Découvrez les dernières informations partagées par la communauté
        </p>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
        <Filter className="size-4 text-gray-600" />
        <Button
          variant={filter === 'recent' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('recent')}
        >
          Récents
        </Button>
        <Button
          variant={filter === 'popular' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('popular')}
        >
          Populaires
        </Button>
      </div>

      {/* Liste des posts */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {sortedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun article pour le moment</p>
          <p className="text-sm text-gray-400 mt-2">Soyez le premier à publier une information !</p>
        </div>
      )}

      {/* Message de fin */}
      {!loading && posts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Vous avez vu tous les articles récents</p>
        </div>
      )}
    </div>
  );
}