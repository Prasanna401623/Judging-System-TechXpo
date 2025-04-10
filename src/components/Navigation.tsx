import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { useAdmin } from '@/hooks/useAdmin';
import { useJudge } from '@/hooks/useJudge';

export function Navigation() {
  const pathname = usePathname();
  const { isAdmin, logout: adminLogout } = useAdmin();
  const { judgeName, logout: judgeLogout } = useJudge();
  const isAdminPage = pathname === '/admin';

  const handleAdminLogout = () => {
    adminLogout();
  };

  const handleJudgeLogout = () => {
    judgeLogout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold">
            Hawkathon
          </Link>
          <div className="flex gap-4">
            {isAdminPage ? (
              <Button onClick={handleAdminLogout} variant="outline">
                Logout
              </Button>
            ) : judgeName ? (
              <Button onClick={handleJudgeLogout} variant="outline">
                Logout ({judgeName})
              </Button>
            ) : !isAdmin ? (
              <Link href="/admin">
                <Button variant="outline">Admin Panel</Button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
} 