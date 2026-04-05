import { Card } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { FileText, Plus } from 'lucide-react';

interface NoArticlesAlertProps {
  onCreateArticle?: () => void;
}

export function NoArticlesAlert({ onCreateArticle }: NoArticlesAlertProps) {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center">
          <FileText className="size-8 text-gray-400" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Vous n'avez pas encore publié d'articles
          </h3>
          <p className="text-gray-600 max-w-md">
            Commencez à partager vos informations et actualités avec la communauté en créant votre premier article.
          </p>
        </div>
        
        <Button 
          onClick={onCreateArticle}
          className="mt-4"
        >
          <Plus className="size-4 mr-2" />
          Créer mon premier article
        </Button>
      </div>
    </Card>
  );
}
