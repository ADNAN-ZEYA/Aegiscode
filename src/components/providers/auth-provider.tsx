'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { clientAuth } from '@/lib/firebase/client';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientAuth) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(clientAuth, async (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      const token = nextUser ? await nextUser.getIdToken() : '';
      await fetch('/api/auth/session', {
        method: nextUser ? 'POST' : 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'application/json',
        },
        body: nextUser
          ? JSON.stringify({
              uid: nextUser.uid,
              email: nextUser.email,
              name: nextUser.displayName,
              image: nextUser.photoURL,
            })
          : undefined,
      });
    });
  }, []);

  const value = useMemo(() => ({ user, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
