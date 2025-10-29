import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'login', element: <Login /> },
    ]
  }
]);

export default router;
