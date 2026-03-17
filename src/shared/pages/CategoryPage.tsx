import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { api } from '../services/api/postServices';
import { Post, Category } from '../types';
import { Loader2 } from 'lucide-react';
import { PostCard } from '@/features/posts/components/PostCard';

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [category]);

  const loadPosts = async () => {
    if (!category) return;
    
    try {
      setLoading(true);
      const data = await api.getPostsByCategory(category);
      setPosts(data);
    } catch (error) {
      console.error('Error loading category posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryTitles: Record<Category, string> = {
    sports: 'Sports',
    communauté: 'Communauté',
    école: 'École',
    politique: 'Politique',
    technologie: 'Technologie',
    actualité: 'Actualité',
  };

  const categoryDescriptions: Record<Category, string> = {
    sports: 'Toutes les actualités sportives du pays',
    communauté: 'Initiatives et événements de la communauté',
    école: 'Éducation, formations et vie scolaire',
    politique: 'Politique nationale et débats publics',
    technologie: 'Innovation, startups et technologie',
    actualité: 'Les dernières nouvelles du pays',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* En-tête de catégorie */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {categoryTitles[category as Category]}
        </h1>
        <p className="text-gray-600">
          {categoryDescriptions[category as Category]}
        </p>
        {!loading && (
          <div className="mt-4 text-sm text-gray-500">
            {posts.length} article{posts.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Liste des posts */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun article dans cette catégorie pour le moment</p>
        </div>
      )}
    </div>
  );
}