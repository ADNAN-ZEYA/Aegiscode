'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import { forgotPasswordSchema } from '@/features/auth/schemas';
import { clientAuth } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ForgotPasswordInput = { email: string };

export default function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const submit = form.handleSubmit(async ({ email }) => {
    if (!clientAuth) {
      return;
    }

    await sendPasswordResetEmail(clientAuth, email);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>We’ll email you a secure reset link.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register('email')} />
          </div>
          <Button className="w-full" type="submit">Send reset link</Button>
          <p className="text-center text-sm text-muted-foreground">
            Return to <Link href="/login" className="text-foreground">sign in</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
