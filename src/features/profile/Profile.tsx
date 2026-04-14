
import { Card } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Settings, Edit, Loader2, Search } from 'lucide-react';
import { usePosts } from '@/features/posts/hooks/usePosts';
import { PostCard } from '@/features/posts/components/PostCard';
import { NoArticlesAlert } from '@/features/posts/components/NoArticlesAlert';
import { randomAvatar } from '@/shared/types';
import { useAuth } from '@/shared/hooks/useAuth';
import { getPostsWithSecretCode } from '@/shared/utils/checkSecretCode';
import { decryptData } from '@/shared/utils/crypto';

export function Profile() {
  const filter = 'recent';
  const { isAuthenticated, user } = useAuth()
  console.log(`l'utilisateur: ${JSON.stringify(user)}`)
  
  // Pour la démo, on utilise "Utilisateur"
  // const userName = 'Utilisateur';

  // Utiliser le hook usePosts pour récupérer tous les posts
  const { getAllPosts } = usePosts({ page: 1, limit: 100, sort: filter });

  // Pour la démo, filtrer par nom d'utilisateur ou afficher tous les posts
  const allPosts = getAllPosts.data?.posts || [];
  const loading = getAllPosts.isLoading;

  // Décrypter le code secret de l'utilisateur et filtrer les posts
  const userSecretCode = user?.encryptedSecretCode ? decryptData(user.encryptedSecretCode) : '';
  const postsWithSecretCode = getPostsWithSecretCode(userSecretCode, allPosts);

  const totalLikes = postsWithSecretCode.reduce((sum, post) => sum + post.likes, 0);
  const totalViews = postsWithSecretCode.reduce((sum, post) => sum + post.views, 0);

  if (!isAuthenticated) {
    window.location.href = "/"
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Carte de profil */}
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-6">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${randomAvatar}`}
            alt="Avatar"
            className="size-24 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{isAuthenticated && user?.pseudo}</h1>
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
              {user?.bio ? user.bio : "Passionné d'actualités locales. Je partage des informations vérifiées sur gbairai."}
            </p>

            {/* Stats */}
            <div className="flex gap-6 mt-6">
              <div>
                <div className="text-2xl font-bold text-gray-900">{allPosts && postsWithSecretCode.length}</div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{allPosts && postsWithSecretCode && totalLikes}</div>
                <div className="text-sm text-gray-600">J'aime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{allPosts && postsWithSecretCode && totalViews}</div>
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
          <p className="text-gray-600 text-sm mt-1">{allPosts && postsWithSecretCode.length} article(s) publié(s)</p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : allPosts && postsWithSecretCode.length === 0 ? (
        <NoArticlesAlert 
          onCreateArticle={() => {
            window.location.href = "/create"
            console.log('Navigate to create article');
          }}
        />
      ) : (
        <div className="space-y-6 mb-8">
          {allPosts && postsWithSecretCode && postsWithSecretCode.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Articles contenant le code secret */}
      {/* <div className="mb-4 mt-8">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Search className="size-5" />
          Articles avec votre code secret
        </h2>
        {!loading && userSecretCode && (
          <p className="text-gray-600 text-sm mt-1">
            {postsWithSecretCode.length} article(s) contenant votre code secret
          </p>
        )}
        {!userSecretCode && (
          <p className="text-gray-500 text-sm mt-1">Code secret non disponible</p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : postsWithSecretCode.length > 0 ? (
        <div className="space-y-6">
          {postsWithSecretCode.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : userSecretCode ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun article ne contient votre code secret</p>
        </div>
      ) : null} */}
    </div>
  );
}