import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildMetadata } from '@/lib/seo';
import { getProfileByUsername } from '@/services/user.service';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  return buildMetadata({
    title: profile ? `${profile.name} | Profile` : 'Profile not found',
    description: profile?.bio ?? 'Community member profile.',
    path: `/profile/${username}`,
  });
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <Badge>{profile.role}</Badge>
          <CardTitle className="text-4xl">{profile.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>@{profile.username}</p>
          <p>{profile.bio}</p>
          <p>{profile.bookmarksCount} saved items</p>
        </CardContent>
      </Card>
    </div>
  );
}
