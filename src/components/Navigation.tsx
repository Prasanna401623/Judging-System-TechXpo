import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { useAdmin } from '@/hooks/useAdmin';
import { useJudge } from '@/hooks/useJudge';

export function Navigation() {
  const pathname = usePathname();
  const { isAdmin, logout: adminLogout } = useAdmin();
  const { judgeCode, judgeName, logout: judgeLogout } = useJudge();
  const isAdminPage = pathname === '/admin';

  const handleAdminLogout = () => {
    adminLogout();
  };

  const handleJudgeLogout = () => {
    judgeLogout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between h-auto sm:h-16 py-3 sm:py-0 items-center gap-3 sm:gap-0">
          <Link href="/" className="flex flex-col items-center sm:items-start group">
            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              Hawkathon 2026
            </span>
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Powered by <span className="text-blue-600">ACM</span> & <span className="text-red-500">GDSC</span>
            </span>
          </Link>
          <div className="flex gap-4 items-center">
            {isAdmin && (
              <Link href="/leaderboard">
                <Button variant="outline">🏆 Leaderboard</Button>
              </Link>
            )}
            {!isAdminPage && (
              <Link href="/admin">
                <Button variant="outline">Admin Panel</Button>
              </Link>
            )}
            {isAdminPage ? (
              <Button onClick={handleAdminLogout} variant="outline">
                Logout
              </Button>
            ) : (judgeName || judgeCode) ? (
              <Button onClick={handleJudgeLogout} variant="outline">
                Logout ({judgeName})
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
} 