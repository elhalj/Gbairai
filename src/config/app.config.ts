// Configuration de l'application
export const APP_CONFIG = {
  name: 'Journal Collab',
  version: '1.0.0',
  description: 'Plateforme collaborative de journalisme',
};

// Configuration API
export const API_CONFIG = {
  baseUrl: import.meta.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 10000,
  retryAttempts: 3,
};

// Configuration UI
export const UI_CONFIG = {
  theme: 'light',
  language: 'fr',
  postsPerPage: 10,
  infiniteScrollThreshold: 3,
};
