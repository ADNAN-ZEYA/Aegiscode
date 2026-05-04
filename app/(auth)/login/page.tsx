'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, type User } from 'firebase/auth';
import { authSchema } from '@/features/auth/schemas';
import { clientAuth } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginInput = { email: string; password: string };

async function createSession(user: User) {
  await fetch('/api/auth/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      image: user.photoURL,
    }),
  });

  let idToken: string | undefined;
  try { idToken = await user.getIdToken(); } catch { /* no-op */ }

  await fetch('/api/auth/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      image: user.photoURL,
    }),
  });
}

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(authSchema),
  });

  const submit = form.handleSubmit(async ({ email, password }) => {
    if (!clientAuth) {
      setErrorMessage('Firebase client configuration is missing.');
      return;
    }
    setIsPending(true);
    setErrorMessage(null);

    try {
      const credentials = await signInWithEmailAndPassword(clientAuth, email, password);
      await createSession(credentials.user);
      router.push('/');
      router.refresh();
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        setErrorMessage('Invalid email or password.');
      } else if (code === 'auth/too-many-requests') {
        setErrorMessage('Too many attempts. Please try again later.');
      } else {
        setErrorMessage('Unable to sign in. Please try again.');
      }
    } finally {
      setIsPending(false);
    }
  });

  async function handleGoogle() {
    if (!clientAuth) return;
    setIsGooglePending(true);
    setErrorMessage(null);
    try {
      const credentials = await signInWithPopup(clientAuth, new GoogleAuthProvider());
      await createSession(credentials.user);
      router.push('/');
      router.refresh();
    } catch {
      setErrorMessage('Google sign-in failed. Please try again.');
    } finally {
      setIsGooglePending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Access your reading history, bookmarks, and student dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...form.register('email')} />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...form.register('password')} />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <Button
          variant="outline"
          className="w-full"
          disabled={isGooglePending}
          onClick={handleGoogle}
        >
          {isGooglePending ? 'Connecting…' : 'Continue with Google'}
        </Button>

        {errorMessage && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Link href="/forgot-password" className="hover:text-foreground">Forgot password?</Link>
          <Link href="/signup" className="hover:text-foreground">Create account</Link>
        </div>
      </CardContent>
    </Card>
  );
}
