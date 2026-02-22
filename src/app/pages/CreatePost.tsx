import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card } from '../components/ui/card';
import { Category } from '../types';
import { api } from '../services/api';
import { toast } from 'sonner';

export function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [authorName, setAuthorName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !authorName) return;
    
    try {
      setLoading(true);
      await api.createPost({
        title,
        content,
        category,
        authorName,
        image: imagePreview || undefined,
      });
      
      toast.success('Article publié avec succès !');
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Erreur lors de la publication de l\'article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Bouton retour */}
      <Link to="/">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="size-4 mr-2" />
          Annuler
        </Button>
      </Link>

      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Publier une information
        </h1>
        <p className="text-gray-600">
          Partagez des informations vérifiées avec la communauté
        </p>
      </div>

      {/* Formulaire */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom de l'auteur */}
          <div className="space-y-2">
            <Label htmlFor="authorName">Votre nom *</Label>
            <Input
              id="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Votre nom complet..."
              required
            />
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actualité">Actualité</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="communauté">Communauté</SelectItem>
                <SelectItem value="école">École</SelectItem>
                <SelectItem value="politique">Politique</SelectItem>
                <SelectItem value="technologie">Technologie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de votre article..."
              required
            />
          </div>

          {/* Contenu */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Rédigez votre article ici... Assurez-vous que les informations sont vérifiées et véridiques."
              className="min-h-64"
              required
            />
            <p className="text-xs text-gray-500">
              Minimum 100 caractères - {content.length}/100
            </p>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label>Image (optionnel)</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Prévisualisation"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setImagePreview(null)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="size-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600">
                    Cliquez pour ajouter une image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG jusqu'à 10MB
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          {/* Avertissement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Rappel :</strong> En publiant sur gbairai, vous vous engagez à partager des informations véridiques et vérifiées. Les fausses informations peuvent avoir des conséquences graves.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Link to="/">
              <Button type="button" variant="outline" disabled={loading}>
                Annuler
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={!title || !content || !category || !authorName || content.length < 100 || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Publication...
                </>
              ) : (
                'Publier l\'article'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}