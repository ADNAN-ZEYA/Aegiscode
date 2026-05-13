import { listUsers } from '@/services/user.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminUsersPage() {
  const users = await listUsers();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">User management</p>
        <h1 className="font-serif text-2xl sm:text-4xl">Roles, access, and moderation</h1>
      </div>
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.uid}>
            <CardHeader>
              <CardTitle className="text-xl">{user.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>@{user.username}</span>
              <span>{user.email}</span>
              <span>{user.role}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
