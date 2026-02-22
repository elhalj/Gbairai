import { Post } from '../types';

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Victoire éclatante de l\'équipe nationale de football',
    content: 'L\'équipe nationale a remporté une victoire historique hier soir contre son rival régional avec un score de 3-1. Les supporters ont envahi les rues pour célébrer cette performance exceptionnelle qui propulse l\'équipe en finale du championnat.',
    excerpt: 'L\'équipe nationale remporte une victoire historique 3-1 et se qualifie pour la finale.',
    category: 'sports',
    author: {
      name: 'Mamadou Diallo',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mamadou'
    },
    image: 'https://images.unsplash.com/photo-1549923015-badf41b04831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBtYXRjaCUyMHN0YWRpdW18ZW58MXx8fHwxNzcxNzQ2NDIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    createdAt: new Date('2026-02-22T10:30:00'),
    likes: 234,
    comments: 45,
    views: 1205
  },
  {
    id: '2',
    title: 'Nouvelle initiative communautaire pour l\'eau potable',
    content: 'Les habitants du quartier de Madina se mobilisent pour installer un nouveau système d\'approvisionnement en eau potable. Cette initiative citoyenne, menée par des bénévoles locaux, vise à améliorer l\'accès à l\'eau pour plus de 500 familles.',
    excerpt: 'Les habitants de Madina s\'unissent pour améliorer l\'accès à l\'eau potable.',
    category: 'communauté',
    author: {
      name: 'Fatou Camara',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatou'
    },
    image: 'https://images.unsplash.com/photo-1768885510527-a11bcf2aa7ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBtZWV0aW5nJTIwcGVvcGxlfGVufDF8fHx8MTc3MTc3NjczOXww&ixlib=rb-4.1.0&q=80&w=1080',
    createdAt: new Date('2026-02-22T08:15:00'),
    likes: 189,
    comments: 32,
    views: 876
  },
  {
    id: '3',
    title: 'Lancement du programme de bourses pour étudiants brillants',
    content: 'Le Ministère de l\'Éducation annonce le lancement d\'un nouveau programme de bourses destiné aux étudiants méritants. Plus de 500 bourses seront attribuées cette année pour encourager l\'excellence académique.',
    excerpt: '500 bourses d\'excellence seront attribuées aux étudiants méritants.',
    category: 'école',
    author: {
      name: 'Abdoulaye Sow',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abdoulaye'
    },
    image: 'https://images.unsplash.com/photo-1557989048-03456d01a26e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBzdHVkZW50cyUyMGxlYXJuaW5nfGVufDF8fHx8MTc3MTc3NjczOXww&ixlib=rb-4.1.0&q=80&w=1080',
    createdAt: new Date('2026-02-21T14:20:00'),
    likes: 312,
    comments: 58,
    views: 1543
  },
  {
    id: '4',
    title: 'Débat houleux au parlement sur la nouvelle loi',
    content: 'Les députés se sont affrontés hier lors d\'un débat animé concernant le nouveau projet de loi sur les réformes économiques. Les opinions restent divisées entre partisans et opposants du texte.',
    excerpt: 'Débat animé au parlement sur les réformes économiques proposées.',
    category: 'politique',
    author: {
      name: 'Aissatou Barry',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aissatou'
    },
    image: 'https://images.unsplash.com/photo-1645976442368-b2d3fd315932?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2xpdGljcyUyMGdvdmVybm1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NzE3NDQzNzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    createdAt: new Date('2026-02-21T16:45:00'),
    likes: 156,
    comments: 78,
    views: 2103
  },
  {
    id: '5',
    title: 'Startup locale lève 2 millions de dollars',
    content: 'Une jeune startup guinéenne spécialisée dans les solutions de paiement mobile vient de lever 2 millions de dollars auprès d\'investisseurs internationaux. Cette levée de fonds permettra d\'accélérer son expansion en Afrique de l\'Ouest.',
    excerpt: 'Une startup guinéenne lève 2M$ pour son expansion régionale.',
    category: 'technologie',
    author: {
      name: 'Ibrahim Conte',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ibrahim'
    },
    image: 'https://images.unsplash.com/photo-1661286178389-e067299f907e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlY2hub2xvZ3klMjBzdGFydHVwfGVufDF8fHx8MTc3MTc3Njc0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    createdAt: new Date('2026-02-22T09:00:00'),
    likes: 278,
    comments: 41,
    views: 1632
  },
  {
    id: '6',
    title: 'Alerte météo : Fortes pluies attendues ce week-end',
    content: 'Les services météorologiques nationaux alertent sur l\'arrivée de fortes pluies ce week-end dans plusieurs régions du pays. Les populations sont invitées à prendre leurs précautions.',
    excerpt: 'Fortes pluies prévues ce week-end, vigilance recommandée.',
    category: 'actualité',
    author: {
      name: 'Mariama Bah',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mariama'
    },
    image: 'https://images.unsplash.com/photo-1622223145461-271074da3e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2luZyUyMG5ld3MlMjByZXBvcnRlcnxlbnwxfHx8fDE3NzE2OTM0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    createdAt: new Date('2026-02-22T11:00:00'),
    likes: 145,
    comments: 23,
    views: 945
  },
  {
    id: '7',
    title: 'Marathon inter-écoles : Plus de 1000 participants',
    content: 'Le marathon annuel inter-écoles a rassemblé plus de 1000 élèves venus de tout le pays. Cet événement sportif et éducatif a permis de promouvoir les valeurs de l\'effort et de la persévérance.',
    excerpt: '1000 élèves participent au marathon inter-écoles annuel.',
    category: 'école',
    author: {
      name: 'Ousmane Kouyaté',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ousmane'
    },
    createdAt: new Date('2026-02-21T13:30:00'),
    likes: 201,
    comments: 35,
    views: 734
  },
  {
    id: '8',
    title: 'Campagne de vaccination gratuite dans les quartiers',
    content: 'Une grande campagne de vaccination gratuite contre plusieurs maladies a débuté dans les quartiers populaires de la capitale. Les équipes médicales mobiles sillonnent les rues pour atteindre un maximum de personnes.',
    excerpt: 'Campagne de vaccination gratuite lancée dans les quartiers populaires.',
    category: 'communauté',
    author: {
      name: 'Kadiatou Diallo',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kadiatou'
    },
    createdAt: new Date('2026-02-20T15:00:00'),
    likes: 267,
    comments: 47,
    views: 1124
  }
];
