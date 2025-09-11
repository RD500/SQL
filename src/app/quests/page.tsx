import { Suspense } from 'react';
import QuestsList from './quests-list';
import { MainLayout } from '@/components/layout/main-layout';
import { Skeleton } from '@/components/ui/skeleton';

// A simple loading skeleton to show while the client component loads
function Loading() {
  return (
    <MainLayout>
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-5 w-1/2" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-60 w-full" />
                <Skeleton className="h-60 w-full" />
                <Skeleton className="h-60 w-full" />
            </div>
        </div>
    </MainLayout>
  );
}

export default function QuestsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <QuestsList />
    </Suspense>
  );
}
