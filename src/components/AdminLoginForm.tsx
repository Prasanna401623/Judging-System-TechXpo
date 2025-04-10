import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

interface AdminLoginFormProps {
  onLogin: (password: string) => boolean;
}

export function AdminLoginForm({ onLogin }: AdminLoginFormProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = onLogin(password);
    if (!isValid) {
      toast.error('Invalid password');
      setPassword('');
    }
  };

  return (
    <Card className="w-[90%] max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
        <CardDescription>Enter the admin password to continue</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-lg h-12"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full h-12 text-lg" disabled={!password.trim()}>
            Login
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 