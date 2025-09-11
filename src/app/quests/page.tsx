import React from 'react';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// --- Utility Functions (from lib/utils.ts) ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Data (from lib/quests.ts) ---
const quests = [
  {
    id: 'select-basics',
    title: 'The SELECT Statement',
    description: 'Learn the fundamentals of querying data from a table.',
    category: 'Data Querying',
    difficulty: 'Beginner',
    relatedConcepts: ['FROM', 'WHERE'],
  },
  {
    id: 'join-juggler',
    title: 'The Art of the JOIN',
    description: 'Combine rows from two or more tables based on a related column.',
    category: 'Data Relationships',
    difficulty: 'Intermediate',
    relatedConcepts: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN'],
  },
  {
    id: 'aggregation-avenger',
    title: 'Aggregation Avenger',
    description: 'Use aggregate functions to perform a calculation on a set of values.',
    category: 'Data Aggregation',
    difficulty: 'Intermediate',
    relatedConcepts: ['COUNT', 'SUM', 'AVG', 'GROUP BY'],
  },
  {
    id: 'subquery-sorcerer',
    title: 'Subquery Sorcerer',
    description: 'Master the art of nesting queries within other queries.',
    category: 'Advanced Querying',
    difficulty: 'Advanced',
    relatedConcepts: ['IN', 'EXISTS', 'Correlated Subqueries'],
  },
];


// --- UI Components (from components/ui/*) ---

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'h-10 px-4 py-2',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';


const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"


const Badge = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                className
            )}
            {...props}
        />
    );
};


// --- Layout Components (from components/layout/*) ---

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
};


// --- The Main Page Component ---

export default function QuestsPage() {
  const getPageTitle = () => {
    return 'SQL Quests';
  };

  const getPageDescription = () => {
    return 'Embark on quests to master SQL commands, constraints, and more.';
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{getPageTitle()}</h1>
          <p className="text-muted-foreground">{getPageDescription()}</p>
        </div>

        {quests.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quests.map((quest) => (
              <Card key={quest.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{quest.title}</CardTitle>
                    <Badge
                      className={cn(
                        quest.difficulty === 'Beginner' && 'bg-green-100 text-green-800 border-green-200',
                        quest.difficulty === 'Intermediate' && 'bg-yellow-100 text-yellow-800 border-yellow-200',
                        quest.difficulty === 'Advanced' && 'bg-red-100 text-red-800 border-red-200'
                      )}
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
                  <a href={`/quests/${quest.id}`} className="w-full">
                    <Button className="w-full">Start Quest</Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold">No Quests Found</h3>
              <p className="text-muted-foreground mt-2">
                There are currently no quests available. Please check back later.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

