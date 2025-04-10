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
    const isValid = password === 'gdsc123';
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