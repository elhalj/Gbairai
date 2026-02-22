import { Card } from '../components/ui/card';
import { Heart, MessageCircle, User, CheckCheck } from 'lucide-react';
import { Button } from '../components/ui/button';

const mockNotifications = [
  {
    id: '1',
    type: 'like',
    user: 'Aissatou Barry',
    message: 'a aimé votre article',
    post: 'Victoire éclatante de l\'équipe nationale',
    time: 'Il y a 2h',
    read: false
  },
  {
    id: '2',
    type: 'comment',
    user: 'Ibrahim Conte',
    message: 'a commenté votre article',
    post: 'Victoire éclatante de l\'équipe nationale',
    time: 'Il y a 4h',
    read: false
  },
  {
    id: '3',
    type: 'follow',
    user: 'Kadiatou Diallo',
    message: 'a commencé à vous suivre',
    time: 'Il y a 1 jour',
    read: true
  },
  {
    id: '4',
    type: 'like',
    user: 'Ousmane Kouyaté',
    message: 'a aimé votre article',
    post: 'Victoire éclatante de l\'équipe nationale',
    time: 'Il y a 2 jours',
    read: true
  }
];

export function Notifications() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="size-5 text-red-600" />;
      case 'comment':
        return <MessageCircle className="size-5 text-blue-600" />;
      case 'follow':
        return <User className="size-5 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 text-sm mt-1">
            {mockNotifications.filter(n => !n.read).length} nouvelle(s) notification(s)
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <CheckCheck className="size-4 mr-2" />
          Tout marquer comme lu
        </Button>
      </div>

      {/* Liste des notifications */}
      <div className="space-y-2">
        {mockNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              !notification.read ? 'bg-blue-50 border-blue-200' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icône */}
              <div className="mt-1">
                {getIcon(notification.type)}
              </div>

              {/* Contenu */}
              <div className="flex-1">
                <p className="text-gray-900">
                  <span className="font-medium">{notification.user}</span>{' '}
                  <span className="text-gray-700">{notification.message}</span>
                  {notification.post && (
                    <>
                      {' "'}
                      <span className="font-medium">{notification.post}</span>
                      {'"'}
                    </>
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
              </div>

              {/* Indicateur non lu */}
              {!notification.read && (
                <div className="size-2 bg-blue-600 rounded-full mt-2"></div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Message de fin */}
      <div className="text-center py-8 text-gray-500">
        <p>Vous avez vu toutes vos notifications</p>
      </div>
    </div>
  );
}
