import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import Dashboard from '../pages/Dashboard';
import TermsAndConditions from '../pages/TermsAndConditions';
import CustomerSupport from '../pages/CustomerSupport';
import ContactUs from '../pages/ContactUs';
import About from '../pages/About';
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
      { path: 'terms', element: <TermsAndConditions /> },
      { path: 'support', element: <CustomerSupport /> },
      { path: 'contact', element: <ContactUs /> },
      { path: 'about', element: <About /> },
    ]
  }
]);

export default router;
