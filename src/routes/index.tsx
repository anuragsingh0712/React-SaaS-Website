import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import { RequireAuth } from '../components/RequireAuth';
import { Login } from '../pages/Login';
import { ForgotPassword } from '../pages/ForgotPassword';
import { Home } from '../pages/Home';
import { Dashboard } from '../pages/Dashboard';
import { Features } from '../pages/Features';
import { Pricing } from '../pages/Pricing';
import { Resources } from '../pages/Resources';
import { ResourceDetail } from '../pages/ResourceDetail';
import { Contact } from '../pages/Contact';
import { Profile } from '../pages/Profile';
import { Notifications } from '../pages/Notifications';
import { NotFound } from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <App />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'features', element: <Features /> },
      { path: 'pricing', element: <Pricing /> },
      { path: 'resources', element: <Resources /> },
      { path: 'resources/:id', element: <ResourceDetail /> },
      { path: 'contact', element: <Contact /> },
      { path: 'profile', element: <Profile /> },
      { path: 'notifications', element: <Notifications /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
