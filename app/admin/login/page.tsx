'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth';
import { clientAuth } from '@/lib/firebase/client';
import { Shield, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';

const adminLoginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
  });

  async function handleSessionAndRedirect(firebaseUser: User) {
    // Upsert profile and check role
    const profileRes = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        image: firebaseUser.photoURL,
      }),
    });
    const profile = await profileRes.json();

    if (profile.role !== 'admin') {
      setErrorMessage('Access denied. This portal is for administrators only.');
      return;
    }

    // Get ID token for full session (if Firebase Admin SDK is configured)
    let idToken: string | undefined;
    try {
      idToken = await firebaseUser.getIdToken();
    } catch {
      idToken = undefined;
    }

    // Set session cookie (falls back to dev-session if Firebase Admin not configured)
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
      body: JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        image: firebaseUser.photoURL,
      }),
    });

    router.push('/admin');
    router.refresh();
  }

  const submit = form.handleSubmit(async ({ email, password }) => {
    if (!clientAuth) {
      setErrorMessage('Firebase configuration is missing.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const credentials = await signInWithEmailAndPassword(clientAuth, email, password);
      await handleSessionAndRedirect(credentials.user);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password'
      ) {
        setErrorMessage('Invalid email or password.');
      } else {
        setErrorMessage('Sign-in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  });

  async function handleGoogle() {
    if (!clientAuth) return;
    setIsGoogleLoading(true);
    setErrorMessage(null);
    try {
      const credentials = await signInWithPopup(clientAuth, new GoogleAuthProvider());
      await handleSessionAndRedirect(credentials.user);
    } catch {
      setErrorMessage('Google sign-in failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#08080f] px-4">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px]" />
      {/* Glow blobs */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-700/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-indigo-700/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Branding */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-violet-600/20 shadow-lg shadow-violet-500/20 backdrop-blur">
            <Shield className="h-7 w-7 text-violet-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Admin Portal</h1>
            <p className="text-sm text-white/40">AegisCode — restricted access</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
          <form className="space-y-5" onSubmit={submit}>
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-xs font-medium uppercase tracking-widest text-white/40"
              >
                Admin Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  {...form.register('email')}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/25 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50"
                  placeholder="admin@example.com"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-medium uppercase tracking-widest text-white/40"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...form.register('password')}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-11 text-sm text-white placeholder-white/25 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
              {isLoading ? 'Verifying…' : 'Sign in to Admin'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/25">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            disabled={isGoogleLoading}
            onClick={handleGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs text-white/25">
            Student?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300">
              Go to student login →
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-white/15">
          Unauthorized access attempts are logged and monitored.
        </p>
      </div>
    </div>
  );
}
