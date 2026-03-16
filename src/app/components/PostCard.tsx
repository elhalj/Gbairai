import { Link } from 'react-router';
import { Heart, MessageCircle, Eye, Share2 } from 'lucide-react';
import { Post } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const categoryColors: Record<string, string> = {
    sports: 'bg-green-100 text-green-700',
    communauté: 'bg-purple-100 text-purple-700',
    école: 'bg-blue-100 text-blue-700',
    politique: 'bg-red-100 text-red-700',
    technologie: 'bg-orange-100 text-orange-700',
    actualité: 'bg-gray-100 text-gray-700',
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/post/${post.id}`}>
        {post.image && (
          <div className="aspect-[16/9] sm:aspect-[16/9] overflow-hidden bg-gray-100">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-3 sm:p-4 space-y-3">
          {/* Catégorie et date */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <Badge className={categoryColors[post.category] + " w-fit"}>
              {post.category}
            </Badge>
            <span className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Titre */}
          <h2 className="font-semibold text-base sm:text-lg line-clamp-2 text-gray-900">
            {post.title}
          </h2>

          {/* Extrait */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Auteur */}
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="size-8 rounded-full"
            />
            <span className="text-sm text-gray-700">{post.author.name}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 sm:gap-4 pt-2 border-t border-gray-100 flex-wrap">
            <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
              <Heart className="size-4" />
              <span className="text-xs sm:text-sm">{(post.likes).toLocaleString()}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
              <MessageCircle className="size-4" />
              <span className="text-xs sm:text-sm">{(post.comments).toLocaleString()}</span>
            </button>
            <div className="flex items-center gap-1 text-gray-600">
              <Eye className="size-4" />
              <span className="text-xs sm:text-sm">{(post.views).toLocaleString()}</span>
            </div>
            <button className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors ml-auto">
              <Share2 className="size-4" />
              <span className="sr-only">Partager</span>
            </button>
          </div>
        </div>
      </Link>
    </Card>
  );
}