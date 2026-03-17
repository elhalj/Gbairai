import { useState } from 'react';
import { Link } from 'react-router';
import { Menu, PlusCircle, Bell, User, Database } from 'lucide-react';
import { toast } from 'sonner';
import { seedDatabase } from '@/shared/utils/seedData';
import { Button } from '../ui/button';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [seeding, setSeeding] = useState(false);

  const handleSeedData = async () => {
    setSeeding(true);
    const success = await seedDatabase();
    if (success) {
      toast.success('Données de démo chargées !');
      // Émettre un événement personnalisé pour notifier le composant Home
      window.dispatchEvent(new CustomEvent('demoDataLoaded'));
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast.error('Erreur lors du chargement des données');
    }
    setSeeding(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo et menu mobile */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="size-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg px-3 py-2">
              <img src="/src/app/assets/logo.webp" alt="gbairai" className="size-10" />
            </div>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSeedData}
            disabled={seeding}
            className="hidden sm:flex"
          >
            <Database className="size-4 mr-2" />
            Données démo
          </Button>
          <Link to="/create">
            <Button size="sm" className="gap-2">
              <PlusCircle className="size-4" />
              <span className="hidden sm:inline">Publier</span>
            </Button>
          </Link>
          <Button variant="ghost" size="sm">
            <Bell className="size-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}