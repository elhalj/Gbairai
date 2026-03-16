import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { api } from '../services/api';
import { Post } from '../types';
import { Heart, MessageCircle, Eye, Share2, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

export function PostDetail() {
  const avatars = [
          "👩🏻‍🎤",
          "👨🏻‍🎤",
          "👱‍♀️",
          "🦸‍♀️",
          "🧝‍♀️",
          "🧝‍♂️",
          "🤖",
          "🧑‍🎤",
          "👩‍🎤",
          "👨‍🎤",
  ];
  const avatarRandom = avatars[Math.floor(Math.random() * avatars.length)]
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    loadPost();
    loadComments();
  }, [id]);

  const loadPost = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await api.getPost(id);
      setPost(data);
      
      // Incrémenter les vues
      await api.incrementViews(id);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    if (!id) return;
    
    try {
      const data = await api.getComments(id);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleLike = async () => {
    if (!id || !post) return;
    
    try {
      const userId = localStorage.getItem('userId') || crypto.randomUUID();
      localStorage.setItem('userId', userId);
      
      const updatedPost = await api.likePost(id, userId);
      setPost(updatedPost);
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Erreur lors du like');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentContent || !commentAuthor) return;
    
    try {
      setSubmitting(true);
      await api.addComment(id, commentContent, commentAuthor);
      setCommentContent('');
      toast.success('Commentaire ajouté !');
      loadComments();
      loadPost(); // Recharger pour mettre à jour le compteur
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
        <Link to="/">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    sports: 'bg-green-100 text-green-700',
    communauté: 'bg-purple-100 text-purple-700',
    école: 'bg-blue-100 text-blue-700',
    politique: 'bg-red-100 text-red-700',
    technologie: 'bg-orange-100 text-orange-700',
    actualité: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Bouton retour */}
      <div className="mb-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-sm">
            <ArrowLeft className="size-4 mr-2" />
            Retour
          </Button>
        </Link>
      </div>

      {/* Article */}
      <article className="bg-white rounded-lg overflow-hidden">
        {/* Image principale */}
        {post.image && (
          <div className="aspect-[16/9] overflow-hidden bg-gray-100">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-4">
          {/* Catégorie et date */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <Badge className={categoryColors[post.category] + " w-fit"}>
              {post.category}
            </Badge>
            <span className="text-sm text-gray-500">
              Publié {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: fr })}
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>

          {/* Auteur */}
          <div className="flex items-center gap-3 py-4 border-y border-gray-200">
            <div className='rounded-full text-2xl sm:text-3xl'>{ avatarRandom}</div>
            <div>
              <div className="font-medium text-gray-900">{post.author.name}</div>
              <div className="text-sm text-gray-500">Journaliste citoyen</div>
            </div>
          </div>

          {/* Contenu */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>

          {/* Stats et actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 transition-colors ${
                  liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <Heart className={`size-5 ${liked ? 'text-red-600' : ''}`} />
                <span>{post.likes}</span>
              </button>
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="size-5" />
                <span>{post.comments}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="size-5" />
                <span>{post.views}</span>
              </div>
            </div>
            <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors sm:ml-auto">
              <Share2 className="size-5" />
              <span>Partager</span>
            </button>
          </div>
        </div>
      </article>

      {/* Section commentaires */}
      <Card className="mt-6 p-4 sm:p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Commentaires ({post.comments})
        </h2>

        {/* Formulaire de commentaire */}
        <form onSubmit={handleCommentSubmit} className="space-y-3 mb-6">
          <div>
            <Label htmlFor="commentAuthor" className="text-sm font-medium">Votre nom</Label>
            <Input
              id="commentAuthor"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder="Votre nom..."
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="commentContent" className="text-sm font-medium">Commentaire</Label>
            <Textarea
              id="commentContent"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="mt-1 min-h-24"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Publication...
                </>
              ) : (
                'Publier le commentaire'
              )}
            </Button>
          </div>
        </form>

        {/* Liste des commentaires */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-4">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {comment.author_name?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.author_name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              Aucun commentaire pour le moment. Soyez le premier à commenter !
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}