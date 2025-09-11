import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import QuestClientPage from './quest-client'; // Import the component you just created

export default function QuestPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full w-full absolute inset-0">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <QuestClientPage />
    </Suspense>
  );
}
