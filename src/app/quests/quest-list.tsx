'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { quests } from '@/lib/quests';
import { useSearchParams } from 'next/navigation';

export default function QuestList() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const categoryQuery = searchParams.get('category');

  const filteredQuests = quests.filter(quest => {
    const searchMatch = searchQuery
      ? quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quest.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const categoryMatch = categoryQuery
      ? quest.category === categoryQuery
      : true;

    return searchMatch && categoryMatch;
  });

  return (
    <MainLayout>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredQuests.map((quest) => (
          <Card key={quest.id}>
            <CardHeader>
              <CardTitle>{quest.title}</CardTitle>
              <CardDescription>{quest.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{quest.description}</p>
              <Badge>{quest.difficulty}</Badge>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={`/quests/${quest.id}`}>Start Quest</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}
