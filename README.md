# Application d'Information Communautaire - GBAIRAI

Une application web moderne et interactive pour la diffusion d'informations communautaires, construite avec React et les meilleures technologies frontend.

## 🌟 Fonctionnalités

- **Interface utilisateur moderne** avec Material-UI et Radix UI
- **Design responsive** adapté à tous les appareils
- **Navigation intuitive** avec React Router
- **Composants interactifs** avec animations fluides (Motion/Framer Motion)
- **Thème sombre/clair** avec Next Themes
- **Graphiques et visualisations** avec Recharts
- **Gestion de formulaires** avec React Hook Form
- **Carrousels et galeries** avec Embla Carousel
- **Drag & Drop** avec React DnD

## 🛠️ Stack Technique

### Frontend

- **React 18.3.1** - Bibliothèque principale
- **Vite** - Outil de build et développement
- **TypeScript** - Typage statique (supporté)

### UI & Styling

- **Material-UI (MUI) v7** - Composants Material Design
- **Radix UI** - Composants accessibles et headless
- **Tailwind CSS v4** - Framework CSS utilitaire
- **Lucide React** - Icônes modernes
- **Emotion** - Bibliothèque CSS-in-JS

### État & Logique

- **React Hook Form** - Gestion de formulaires
- **React Router v7** - Routage client
- **Next Themes** - Gestion des thèmes

### Visualisation & Interactions

- **Recharts** - Graphiques et diagrammes
- **React Slick** - Carrousels
- **React DnD** - Drag and Drop
- **Motion** - Animations fluides

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- npm, yarn ou pnpm

### Installation

1. **Cloner le dépôt**

   ```bash
   git clone <url-du-repository>
   cd "Application d'information communautaire"
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Démarrer le serveur de développement**

   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

4. **Ouvrir votre navigateur**
   Navigatez vers `http://localhost:5173`

## 📜 Scripts Disponibles

```bash
# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

## 📁 Structure du Projet

```
Application d'information communautaire/
├── public/                 # Fichiers statiques
├── src/                   # Code source
│   ├── components/        # Composants réutilisables
│   ├── pages/            # Pages de l'application
│   ├── hooks/            # Hooks personnalisés
│   ├── utils/            # Fonctions utilitaires
│   ├── styles/           # Styles globaux
│   └── main.jsx          # Point d'entrée
├── guidelines/           # Documentation et guides
├── package.json          # Dépendances et scripts
├── vite.config.js        # Configuration Vite
├── tailwind.config.js    # Configuration Tailwind
└── README.md            # Ce fichier
```

## 🎨 Design & UX

L'application suit les principes de design moderne :

- **Material Design 3** avec Material-UI
- **Accessibilité** avec composants Radix UI
- **Responsive Design** adaptatif mobile-first
- **Animations fluides** pour une expérience utilisateur agréable
- **Thème cohérent** avec mode sombre/clair

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=GBAIRAI
```

### Personnalisation du Thème

Les couleurs et le thème peuvent être personnalisés dans :

- `src/styles/theme.js` - Configuration Material-UI
- `tailwind.config.js` - Configuration Tailwind CSS

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📝 Guidelines

Consultez le dossier `guidelines/` pour :

- Les conventions de code
- Les principes de design
- Les bonnes pratiques UX/UI
- Les processus de développement

## 🌐 Lien Figma

Le design original est disponible sur :
[Application d'information communautaire - Figma](https://www.figma.com/make/pCYM14EoYCsM3v7emrMqu4/Application-d-information-communautaire?t=PTL82dSzOtUxfMHH-1)

## 📄 Licence

Ce projet est sous licence privée.

## 📞 Support

Pour toute question ou problème, veuillez contacter l'équipe de développement.

---

**Développé avec ❤️ pour la communauté GBAIRAI**
