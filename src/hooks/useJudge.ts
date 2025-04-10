import { useState, useEffect } from 'react';

export function useJudge() {
  const [judgeName, setJudgeName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedName = localStorage.getItem('judgeName');
    setJudgeName(storedName);
    setIsLoading(false);
  }, []);

  const setJudgeNameWithStorage = (name: string) => {
    localStorage.setItem('judgeName', name);
    setJudgeName(name);
  };

  const logout = () => {
    localStorage.removeItem('judgeName');
    setJudgeName(null);
    // Force a page reload to clear any cached state
    window.location.reload();
  };

  return {
    judgeName,
    setJudgeName: setJudgeNameWithStorage,
    logout,
    isLoading,
  };
} 