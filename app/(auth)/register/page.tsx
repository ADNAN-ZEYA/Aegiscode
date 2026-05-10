import { redirect } from 'next/navigation';

/**
 * /register → /signup permanent redirect.
 * The landing page and footer link to /register; this ensures both URLs work.
 */
export default function RegisterPage() {
  redirect('/signup');
}
