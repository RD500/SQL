
import { Suspense } from 'react';
import QuestList from './quest-list';

export default function QuestsPage() {
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

  const getPageTitle = () => {
    if (categoryQuery) {
      return `SQL Quests: ${categoryQuery}`;
    }
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    return 'SQL Quests';
  }

  const getPageDescription = () => {
    if (categoryQuery) {
      return `Showing ${filteredQuests.length} quests in the "${categoryQuery}" category.`;
    }
    if (searchQuery) {
      return `Found ${filteredQuests.length} quests matching your search.`;
    }
    return 'Embark on quests to master SQL commands, constraints, and more.';
  }


  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{getPageTitle()}</h1>
          <p className="text-muted-foreground">
            {getPageDescription()}
          </p>
        </div>
        {filteredQuests.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuests.map((quest) => (
              <Card key={quest.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{quest.title}</CardTitle>
                    <Badge
                      variant={quest.difficulty === 'Beginner' ? 'secondary' : quest.difficulty === 'Intermediate' ? 'outline' : 'default'}
                      className={quest.difficulty === 'Advanced' ? 'bg-primary/20 text-primary border-primary/50' : ''}
                    >
                      {quest.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{quest.category}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">{quest.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/quests/${quest.id}`}>Start Quest</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold">No Quests Found</h3>
              <p className="text-muted-foreground mt-2">
                We couldn't find any quests matching your criteria. Try adjusting your search or filter.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/quests">View All Quests</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
