import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 bg-white/5" />
        <Skeleton className="h-9 w-64 bg-white/5" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 bg-white/5" />
        ))}
      </div>

      {/* Main panels */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 bg-white/5 lg:col-span-2" />
        <Skeleton className="h-72 bg-white/5" />
      </div>
    </div>
  );
}
