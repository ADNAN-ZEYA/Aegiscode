'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword, updateProfile, type User } from 'firebase/auth';
import { signupSchema } from '@/features/auth/schemas';
import { clientAuth } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SignupInput = { name: string; username: string; email: string; password: string };

async function createSession(user: User, username?: string) {
  // Create/update profile in Firestore
  await fetch('/api/auth/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      username: username || user.email?.split('@')[0],
      image: user.photoURL,
    }),
  });

  // Set session cookie
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

export default function SignupPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const submit = form.handleSubmit(async ({ name, username, email, password }) => {
    if (!clientAuth) {
      setErrorMessage('Firebase client configuration is missing.');
      return;
    }
    setIsPending(true);
    setErrorMessage(null);

    try {
      const credentials = await createUserWithEmailAndPassword(clientAuth, email, password);
      await updateProfile(credentials.user, { displayName: name });
      await createSession(credentials.user, username);
      router.push('/');
      router.refresh();
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;
      if (code === 'auth/email-already-in-use') {
        setErrorMessage('An account with this email already exists. Please sign in instead.');
      } else if (code === 'auth/weak-password') {
        setErrorMessage('Password is too weak. Use at least 6 characters.');
      } else if (code === 'auth/invalid-email') {
        setErrorMessage('Invalid email address.');
      } else {
        setErrorMessage('Unable to create account. Please try again.');
      }
    } finally {
      setIsPending(false);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          Create a student account to read courses, save materials, and continue learning.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register('name')} placeholder="Your full name" />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" {...form.register('username')} placeholder="yourname" />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register('email')} placeholder="you@example.com" />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...form.register('password')} placeholder="••••••••" />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? 'Creating account…' : 'Create account'}
          </Button>
          {errorMessage && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {errorMessage}
              {errorMessage.includes('already exists') && (
                <span>
                  {' '}
                  <Link href="/login" className="font-semibold underline">
                    Sign in here
                  </Link>
                </span>
              )}
            </div>
          )}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
