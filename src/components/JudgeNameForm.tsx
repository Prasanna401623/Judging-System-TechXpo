import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface JudgeNameFormProps {
  onSubmit: (name: string) => void;
}

export function JudgeNameForm({ onSubmit }: JudgeNameFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Card className="w-[90%] max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Welcome to Hawkathon Judging</CardTitle>
        <CardDescription>Please enter your name to begin judging</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg h-12"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full h-12 text-lg" disabled={!name.trim()}>
            Start Judging
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 