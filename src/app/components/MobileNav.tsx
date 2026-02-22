import { Link, useLocation } from 'react-router';
import { Home, Flame, PlusCircle, Bell, User } from 'lucide-react';
import { cn } from './ui/utils';

const navItems = [
  { id: 'home', label: 'Accueil', icon: Home, path: '/' },
  { id: 'trending', label: 'Tendances', icon: Flame, path: '/trending' },
  { id: 'create', label: 'Publier', icon: PlusCircle, path: '/create' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
  { id: 'profile', label: 'Profil', icon: User, path: '/profile' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 flex-1',
                isActive ? 'text-blue-600' : 'text-gray-600'
              )}
            >
              <Icon className={cn('size-5', item.id === 'create' && 'size-6')} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
