import { useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // In a real app with http-only cookies, we would first hit a /api/auth/get-profile
    // endpoint to verify the session.
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex h-screen overflow-hidden bg-muted/20">
      {/* Sidebar will go here */}
      <aside className="w-64 border-r bg-background hidden md:flex flex-col">
        <div className="p-4 border-b font-bold text-xl">EasyLife Admin</div>
        <nav className="flex-1 p-4 space-y-2">
          {/* Navigation links */}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}
