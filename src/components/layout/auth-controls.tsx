'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Shield, User2 } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { clientAuth } from '@/lib/firebase/client';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';

export function AuthControls() {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Button variant="outline" asChild>
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  const isAdmin = role === 'admin';

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" asChild>
        <Link href={isAdmin ? '/admin' : '/dashboard'}>
          {isAdmin ? <Shield className="h-4 w-4" /> : <User2 className="h-4 w-4" />}
          {isAdmin ? 'Admin' : 'Dashboard'}
        </Link>
      </Button>
      <Button
        variant="ghost"
        onClick={async () => {
          await signOut(clientAuth!);
          router.push('/');
          router.refresh();
        }}
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </div>
  );
}
