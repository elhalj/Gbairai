import { Link } from 'react-router';
import { Heart, MessageCircle, Eye, Share2 } from 'lucide-react';
import { Post } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

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
          <div className="aspect-[16/9] overflow-hidden bg-gray-100">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-4 space-y-3">
          {/* Catégorie et date */}
          <div className="flex items-center justify-between">
            <Badge className={categoryColors[post.category]}>
              {post.category}
            </Badge>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: fr })}
            </span>
          </div>

          {/* Titre */}
          <h2 className="font-semibold text-lg line-clamp-2 text-gray-900">
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
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
            <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
              <Heart className="size-4" />
              <span className="text-sm">{post.likes}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
              <MessageCircle className="size-4" />
              <span className="text-sm">{post.comments}</span>
            </button>
            <div className="flex items-center gap-1 text-gray-600">
              <Eye className="size-4" />
              <span className="text-sm">{post.views}</span>
            </div>
            <button className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors ml-auto">
              <Share2 className="size-4" />
            </button>
          </div>
        </div>
      </Link>
    </Card>
  );
}