import { Link, useLocation } from 'react-router';
import { Home, Flame, Newspaper, GraduationCap, Users, Landmark, Laptop } from 'lucide-react';
import { cn } from '../ui/utils';

const categories = [
  { id: 'home', label: 'Accueil', icon: Home, path: '/' },
  { id: 'trending', label: 'Tendances', icon: Flame, path: '/trending' },
  { id: 'actualité', label: 'Actualité', icon: Newspaper, path: '/category/actualité' },
  { id: 'sports', label: 'Sports', icon: '⚽', path: '/category/sports', emoji: true },
  { id: 'communauté', label: 'Communauté', icon: Users, path: '/category/communauté' },
  { id: 'école', label: 'École', icon: GraduationCap, path: '/category/école' },
  { id: 'politique', label: 'Politique', icon: Landmark, path: '/category/politique' },
  { id: 'technologie', label: 'Technologie', icon: Laptop, path: '/category/technologie' },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className={cn('w-64 border-r border-gray-200 bg-white', className)}>
      <nav className="p-4 space-y-1">
        {categories.map((category) => {
          const isActive = location.pathname === category.path;
          const Icon = category.emoji ? null : category.icon as any;

          return (
            <Link
              key={category.id}
              to={category.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              {category.emoji ? (
                <span className="text-xl">{category.icon}</span>
              ) : (
                <Icon className="size-5" />
              )}
              <span>{category.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
