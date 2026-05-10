export const dynamic = 'force-dynamic';

import type { ReactNode } from 'react';
import { requireAdmin } from '@/lib/auth';
import { AdminSidebar } from '@/components/layout/admin-sidebar';

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-[#08080f]">
      <AdminSidebar
        userName={user.name ?? 'Admin'}
        userEmail={user.email ?? ''}
        userInitial={user.name?.charAt(0)?.toUpperCase() ?? 'A'}
      />

      {/* Main — offset for fixed sidebar on desktop; offset for mobile top bar */}
      <main className="flex-1 overflow-x-hidden pt-14 md:ml-64 md:pt-0">
        <div className="min-h-screen p-4 text-white sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
