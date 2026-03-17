// Constantes de l'application

export const ROUTES = {
  HOME: '/',
  TRENDING: '/trending',
  CATEGORY: '/category/:category',
  POST_DETAIL: '/post/:id',
  CREATE_POST: '/create',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
} as const;

export const POST_CATEGORIES = [
  'Politique',
  'Économie',
  'Société',
  'Culture',
  'Sport',
  'Technologie',
  'International',
  'Santé',
  'Environnement',
] as const;

export const SORT_OPTIONS = {
  RECENT: 'recent',
  POPULAR: 'popular',
} as const;

export const QUERY_KEYS = {
  POSTS: 'posts',
  POST: 'post',
  CATEGORIES: 'categories',
  PROFILE: 'profile',
  NOTIFICATIONS: 'notifications',
} as const;

export const MESSAGES = {
  LOADING: 'Chargement...',
  ERROR: 'Une erreur est survenue',
  NO_POSTS: 'Aucun article pour le moment',
  NO_MORE_POSTS: 'Vous avez vu tous les articles',
  BE_FIRST: 'Soyez le premier à publier une information !',
} as const;
