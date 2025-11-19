import { useState, useEffect } from 'react';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(adminStatus === 'true');
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('Admin password not configured');
      return false;
    }
    const isValid = password === adminPassword;
    if (isValid) {
      localStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
    }
    return isValid;
  };

  const logout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    // Force a page reload to clear any cached state and return to home page
    window.location.href = '/';
  };

  return {
    isAdmin,
    isLoading,
    login,
    logout,
  };
} 