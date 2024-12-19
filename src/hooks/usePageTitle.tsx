import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

const publicRoutes = ['/', '/pricing', '/signin', '/signup'];

const getPageTitle = (pathname: string, isAuthenticated: boolean): string => {
  if (!isAuthenticated || publicRoutes.includes(pathname)) {
    return 'Send Thank You Letters to Your Donors Faster | Thanks From Us';
  }

  // Map routes to page names
  const pageNames: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/settings/actblue': 'ActBlue Settings',
    // Add more routes as needed
  };

  const pageName = pageNames[pathname] || 'Page Not Found';
  return `${pageName} | Thanks From Us`;
};

export const usePageTitle = () => {
  const location = useLocation();
  const { session } = useAuth();
  const isAuthenticated = !!session;

  useEffect(() => {
    const title = getPageTitle(location.pathname, isAuthenticated);
    document.title = title;
  }, [location.pathname, isAuthenticated]);
};

export default usePageTitle;