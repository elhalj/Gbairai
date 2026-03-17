import { useState, useEffect, useRef, useCallback } from 'react';
import { PostCard } from '../../features/posts/components/PostCard';
import { useInfinitePosts } from '../../features/posts/hooks/usePosts';
import { Button } from '../components/ui/button';
import { Filter, Loader2 } from 'lucide-react';

export function Home() {
  const [filter, setFilter] = useState<'recent' | 'popular'>('recent');

  // Utiliser le hook pour le scroll infini
  const { posts, getInfinitePosts } = useInfinitePosts(filter);

  // Ref sur la sentinelle
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = getInfinitePosts.hasNextPage;
  const loading = getInfinitePosts.isLoading;
  const loadingMore = getInfinitePosts.isFetchingNextPage;

  // Charger plus de posts
  const loadMorePosts = useCallback(() => {
    if (hasMore && !loading) {
      getInfinitePosts.fetchNextPage();
    }
  }, [hasMore, loading, getInfinitePosts]);

  // Intersection Observer — se déclenche quand la sentinelle est visible
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
        loadMorePosts();
      }
    },
    [hasMore, loading, loadingMore, loadMorePosts]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,       // viewport
      rootMargin: '0px',
      threshold: 0.1,   // se déclenche à 10% de visibilité
    });

    observer.observe(sentinel);

    // Cleanup : on déconnecte l'observer quand le composant se démonte
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
      {/* En-tête */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
          Fil d'actualité
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Découvrez les dernières informations partagées par la communauté
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 sm:mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-gray-600" />
          <span className="text-sm text-gray-600 font-medium">Filtrer:</span>
        </div>
        <div className="flex gap-2">
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
      </div>

      {/* Chargement initial */}
      {getInfinitePosts.isLoading ? (
        <div className="flex items-center justify-center py-8 sm:py-12">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="space-y-4 sm:space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Sentinelle — élément invisible observé par l'IntersectionObserver */}
          <div ref={sentinelRef} className="h-4" />

          {/* Spinner "load more" */}
          {loadingMore && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="size-6 animate-spin text-blue-600" />
            </div>
          )}

          {/* Fin de liste */}
          {!hasMore && (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <p>Vous avez vu tous les articles</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500">Aucun article pour le moment</p>
          <p className="text-sm text-gray-400 mt-2">
            Soyez le premier à publier une information !
          </p>
        </div>
      )}
    </div>
  );
}