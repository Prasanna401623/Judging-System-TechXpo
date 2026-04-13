import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface JudgeNameFormProps {
  onSubmit: (code: string, name: string) => void;
}

// Map judge codes to names from environment variables
const JUDGE_CODES: Record<string, string> = {};

if (process.env.NEXT_PUBLIC_JUDGE1_CODE && process.env.NEXT_PUBLIC_JUDGE1_NAME) {
  JUDGE_CODES[process.env.NEXT_PUBLIC_JUDGE1_CODE] = process.env.NEXT_PUBLIC_JUDGE1_NAME;
}
if (process.env.NEXT_PUBLIC_JUDGE2_CODE && process.env.NEXT_PUBLIC_JUDGE2_NAME) {
  JUDGE_CODES[process.env.NEXT_PUBLIC_JUDGE2_CODE] = process.env.NEXT_PUBLIC_JUDGE2_NAME;
}
if (process.env.NEXT_PUBLIC_JUDGE3_CODE && process.env.NEXT_PUBLIC_JUDGE3_NAME) {
  JUDGE_CODES[process.env.NEXT_PUBLIC_JUDGE3_CODE] = process.env.NEXT_PUBLIC_JUDGE3_NAME;
}

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
    <Card className="w-full max-w-md mx-auto mt-4 bg-white shadow-xl shadow-blue-900/5 ring-1 ring-gray-900/5 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6">
        <CardTitle>Welcome to Hawkathon 2026 Judging</CardTitle>
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
          <Button type="submit" className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all rounded-xl" disabled={!code.trim()}>
            Start Judging
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 