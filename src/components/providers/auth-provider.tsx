'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { clientAuth } from '@/lib/firebase/client';
import type { Role } from '@/types/common';

interface AuthContextValue {
  user: User | null;
  role: Role | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, role: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientAuth) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(clientAuth, async (nextUser) => {
      setUser(nextUser);

      if (nextUser) {
        const token = await nextUser.getIdToken();

        // Create the session cookie
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: nextUser.uid,
            email: nextUser.email,
            name: nextUser.displayName,
            image: nextUser.photoURL,
          }),
        });

        // Upsert the Firestore profile and get back the authoritative role.
        // This is the ONLY place role is resolved — server-side from the database.
        try {
          const res = await fetch('/api/auth/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: nextUser.uid,
              email: nextUser.email,
              name: nextUser.displayName,
              image: nextUser.photoURL,
            }),
          });
          if (res.ok) {
            const data = (await res.json()) as { role?: Role };
            setRole(data.role ?? 'student');
          } else {
            setRole('student');
          }
        } catch {
          setRole('student');
        }
      } else {
        // Sign-out: clear session cookie and role
        await fetch('/api/auth/session', { method: 'DELETE' });
        setRole(null);
      }

      setLoading(false);
    });
  }, []);

  const value = useMemo(() => ({ user, role, loading }), [user, role, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
