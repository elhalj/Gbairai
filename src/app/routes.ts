import { createBrowserRouter } from 'react-router';
import { Layout } from './pages/Layout';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { PostDetail } from './pages/PostDetail';
import { CreatePost } from './pages/CreatePost';
import { Trending } from './pages/Trending';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'trending', Component: Trending },
      { path: 'category/:category', Component: CategoryPage },
      { path: 'post/:id', Component: PostDetail },
      { path: 'create', Component: CreatePost },
      { path: 'profile', Component: Profile },
      { path: 'notifications', Component: Notifications },
    ],
  },
]);
