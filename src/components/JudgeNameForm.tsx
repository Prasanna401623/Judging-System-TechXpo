import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface JudgeNameFormProps {
  onSubmit: (code: string, name: string) => void;
}

// Map judge codes to names
const JUDGE_CODES: Record<string, string> = {
  'JUDGE1': 'Cameron Brister',
  'JUDGE2': 'Hunter McFadden',
  'JUDGE3': 'Judge 3',
};

export function JudgeNameForm({ onSubmit }: JudgeNameFormProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const upperCode = code.trim().toUpperCase();
    
    if (JUDGE_CODES[upperCode]) {
      setError('');
      onSubmit(upperCode, JUDGE_CODES[upperCode]);
    } else {
      setError('Invalid judge code. Please try again.');
    }
  };

  return (
    <Card className="w-[90%] max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Welcome to TechXpo 2025 Judging</CardTitle>
        <CardDescription>Please enter your judge code to begin judging</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Enter judge code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                className="text-lg h-12"
                required
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-6">
          <Button type="submit" className="w-full h-12 text-lg" disabled={!code.trim()}>
            Start Judging
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 