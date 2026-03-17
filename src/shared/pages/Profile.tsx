import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Settings, Edit, Loader2 } from 'lucide-react';
import { usePosts } from '@/features/posts/hooks/usePosts';
import { PostCard } from '@/features/posts/components/PostCard';

export function Profile() {
  const filter = 'recent' ;
  
  // Pour la démo, on utilise "Utilisateur"
  const userName = 'Utilisateur';

  // Utiliser le hook usePosts pour récupérer tous les posts
  const { getAllPosts } = usePosts({ page: 1, limit: 100, sort: filter });

  // Pour la démo, filtrer par nom d'utilisateur ou afficher tous les posts
  const posts = getAllPosts.data?.posts || [];
  const loading = getAllPosts.isLoading;

  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Carte de profil */}
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-6">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
            alt="Avatar"
            className="size-24 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
                <p className="text-gray-600 mt-1">Journaliste citoyen</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="size-4 mr-2" />
                  Modifier
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="size-4" />
                </Button>
              </div>
            </div>

            <p className="text-gray-700 mt-4">
              Passionné d'actualités locales. Je partage des informations vérifiées sur gbairai.
            </p>

            {/* Stats */}
            <div className="flex gap-6 mt-6">
              <div>
                <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalLikes}</div>
                <div className="text-sm text-gray-600">J'aime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalViews}</div>
                <div className="text-sm text-gray-600">Vues</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Articles publiés */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Mes articles</h2>
        {!loading && (
          <p className="text-gray-600 text-sm mt-1">{posts.length} article(s) publié(s)</p>
        )}
      </div>

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
          <p className="text-gray-500">Vous n'avez pas encore publié d'articles</p>
        </div>
      )}
    </div>
  );
}