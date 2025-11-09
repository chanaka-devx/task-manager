import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'signup', element: <Signup /> },
      { path: 'login', element: <Login /> },
      { path: 'dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
    ]
  }
]);

export default router;
