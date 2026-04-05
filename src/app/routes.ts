import { createBrowserRouter } from 'react-router';
import { Layout } from '../shared/pages/Layout';
import { Home } from '../shared/pages/Home';
import { CategoryPage } from '../shared/pages/CategoryPage';
import { PostDetail } from '../shared/pages/PostDetail';
import { CreatePost } from '../shared/pages/CreatePost';
import { Trending } from '../shared/pages/Trending';
import { Profile } from '../features/profile/Profile';
import { Notifications } from '../shared/pages/Notifications';
import { Register } from '../shared/pages/Register';
import { Login } from '../shared/pages/Login';

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
  {
    path: '/register',
    Component: Register,
  },
  {
    path: '/login',
    Component: Login,
  },
]);
