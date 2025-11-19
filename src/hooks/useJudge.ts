import { useState, useEffect } from 'react';

export function useJudge() {
  const [judgeCode, setJudgeCode] = useState<string | null>(null);
  const [judgeName, setJudgeName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load from localStorage
    const storedCode = localStorage.getItem('judgeCode');
    const storedName = localStorage.getItem('judgeName');
    setJudgeCode(storedCode);
    setJudgeName(storedName);
    setIsLoading(false);

    // Listen for custom storage events to sync across components
    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setJudgeCode(customEvent.detail.judgeCode);
        setJudgeName(customEvent.detail.judgeName);
      }
    };

    window.addEventListener('judgeAuthChange', handleStorageChange);

    return () => {
      window.removeEventListener('judgeAuthChange', handleStorageChange);
    };
  }, []);

  const setJudgeWithStorage = (code: string, name: string) => {
    localStorage.setItem('judgeCode', code);
    localStorage.setItem('judgeName', name);
    setJudgeCode(code);
    setJudgeName(name);
    
    // Dispatch custom event to sync across all components
    window.dispatchEvent(new CustomEvent('judgeAuthChange', {
      detail: { judgeCode: code, judgeName: name }
    }));
  };

  const logout = () => {
    localStorage.removeItem('judgeCode');
    localStorage.removeItem('judgeName');
    setJudgeCode(null);
    setJudgeName(null);
    // Force a page reload to clear any cached state
    window.location.reload();
  };

  return {
    judgeCode,
    judgeName,
    setJudge: setJudgeWithStorage,
    logout,
    isLoading,
  };
} 