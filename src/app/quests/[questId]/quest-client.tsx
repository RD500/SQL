'use client';

import { useState, useEffect, Suspense } from 'react'; // Keep all your original imports
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Terminal, Sparkles, CheckCircle, XCircle, Database } from 'lucide-react';
import { validateSQLQuery } from '@/ai/flows/validate-sql-query';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { quests } from '@/lib/quests';
import type { Quest } from '@/lib/types/quests';
import { getCompletedQuests, completeQuest } from '@/lib/progress';

type Feedback = {
  type: 'success' | 'error' | 'hint' | 'info';
  title: string;
  message: string;
};
type QueryResult = Record<string, any>[] | null;


// The component function is the same, just renamed
export default function QuestClientPage() {
  const params = useParams();
  const questId = params.questId as string;

  const [quest, setQuest] = useState<Quest | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [queryResult, setQueryResult] = useState<QueryResult>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [isQuestFound, setIsQuestFound] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    // Ensure questId is available before finding the quest
    if (!questId) {
      setIsLoading(false);
      setIsQuestFound(false);
      return;
    }

    let currentQuest: Quest | null = null;
    if (questId === 'custom-quest') {
        const storedQuest = sessionStorage.getItem('customQuest');
        if (storedQuest) {
            currentQuest = JSON.parse(storedQuest);
        }
    } else {
        currentQuest = quests.find(q => q.id === questId);
    }
    
    if (currentQuest) {
      setQuest(currentQuest);
      setQuery(currentQuest.initialQuery);
      setFeedback({
        type: 'info',
        title: 'Your Mission!',
        message: 'Your query output or a helpful hint will appear here once you run your query.',
      });
      setQueryResult(null);
      setAttempts(0);
      setIsQuestFound(true);
    } else {
      setIsQuestFound(false);
    }
    setIsLoading(false);
  }, [questId]);

  useEffect(() => {
    const handleProgressUpdate = () => {
      if (typeof window !== 'undefined') {
        setCompleted(getCompletedQuests());
      }
    };
    window.addEventListener('progressUpdated', handleProgressUpdate);
    handleProgressUpdate(); // Initial check

    return () => {
      window.removeEventListener('progressUpdated', handleProgressUpdate);
    };
  }, []);

  const handleRunQuery = async () => {
    if (!quest) return;

    setIsSubmitting(true);
    setFeedback(null);
    setQueryResult(null);
    setAttempts(prev => prev + 1);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const isCustom = quest.id === 'custom-quest';
      const tableSchema = `Table: ${quest.schema.tableName}\nColumns: ${quest.schema.columns.map(c => `${c.name} (${c.type})`).join(', ')}`;
      const response = await validateSQLQuery({
        userQuery: query,
        questDescription: quest.longDescription,
        tableSchema: tableSchema,
        isCustomQuest: isCustom
      });

      if (response.isCorrect) {
        setFeedback({
          type: 'success',
          title: 'Success!',
          message: isCustom ? quest.successMessage : response.feedback,
        });

        if (isCustom && response.simulatedResult) {
            try {
                // The AI returns a JSON string, so we need to parse it
                const simulatedData = JSON.parse(response.simulatedResult);
                setQueryResult(simulatedData);
            } catch (e) {
                console.error("Failed to parse simulated result:", e);
                // Fallback or show error if JSON is invalid
                setQueryResult([{ "status": "Could not display simulated results." }]);
            }
        } else if (!isCustom) {
            setQueryResult(quest.resultData);
        }

        if (!isCustom) {
            completeQuest(quest.id); // Mark quest as completed
        }
      } else {
        setFeedback({
          type: 'error',
          title: "That's not quite right. Here's a hint:",
          message: response.feedback,
        });
      }
    } catch (error: any) {
       console.error('AI Validation Error:', error);

       if (error.message && error.message.includes('The model is overloaded')) {
          setFeedback({
            type: 'error',
            title: 'AI Service Busy',
            message: 'The AI tutor is currently experiencing high demand. Please wait a moment and try running your query again.',
          });
       } else {
          toast({
            variant: 'destructive',
            title: 'Uh oh! AI validation failed.',
            description: 'There was a problem checking your query. Please try again.',
          });
          setFeedback({
            type: 'error',
            title: 'Error',
            message: 'Could not validate your query at this time.',
          });
       }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFeedbackIcon = () => {
    if (!feedback) return <Terminal className="h-4 w-4" />;
    switch (feedback.type) {
        case 'success': return <CheckCircle className="h-4 w-4" />;
        case 'error': return <XCircle className="h-4 w-4" />;
        case 'hint': return <Sparkles className="h-4 w-4" />;
        default: return <Terminal className="h-4 w-4" />;
    }
  }

  const getAlertVariant = () => {
    if (!feedback) return 'default';
    return feedback.type === 'success' ? 'default' : 'destructive';
  }
  
  const resultHeaders = queryResult && queryResult.length > 0 ? Object.keys(queryResult[0]) : [];

  return (
    <MainLayout>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !isQuestFound ? (
        <Card>
          <CardHeader>
            <CardTitle>Quest Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The quest you are looking for does not exist. Please check the URL or go back to the quests page.</p>
          </CardContent>
        </Card>
      ) : quest ? (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenge: {quest.title}</CardTitle>
                <CardDescription>{quest.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{quest.longDescription}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SQL Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="font-code text-sm border rounded-lg p-4 bg-muted/20">
                  <Textarea
                    placeholder="SELECT * FROM employees;"
                    className="bg-transparent border-0 focus-visible:ring-0 p-0 font-code"
                    rows={5}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRunQuery} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Run Query
                  </Button>
                  <Button variant="outline" onClick={() => setQuery(quest.initialQuery)} disabled={isSubmitting}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <AnimatePresence>
              {feedback && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Alert variant={getAlertVariant()}>
                    {getFeedbackIcon()}
                    <AlertTitle>{feedback.title}</AlertTitle>
                    <AlertDescription>{feedback.message}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {queryResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Query Result</CardTitle>
                      <CardDescription>The output of your successful query.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {resultHeaders.map(header => <TableHead key={header}>{header}</TableHead>)}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {queryResult.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {resultHeaders.map(header => <TableCell key={header}>{String(row[header])}</TableCell>)}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-2 space-y-6">
             <Card>
              <CardHeader>
                <CardTitle>Database Schema</CardTitle>
                <CardDescription>Table: {quest.schema.tableName}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quest.schema.columns.map(col => (
                      <TableRow key={col.name}>
                        <TableCell className="font-medium">{col.name}</TableCell>
                        <TableCell>{col.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schema Visualization</CardTitle>
                <CardDescription>An interactive diagram of your database.</CardDescription>
              </CardHeader>
              <CardContent className="h-80 bg-muted/30 rounded-lg p-2 relative flex items-center justify-center overflow-hidden" style={{ perspective: '1000px' }}>
                <motion.div
                  drag
                  dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, cursor: 'grabbing' }}
                  className="p-4 w-56 rounded-lg bg-background border shadow-xl cursor-grab"
                  style={{ rotateX: 20, rotateY: -30, transformStyle: 'preserve-3d' }}
                >
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2"><Database className="h-4 w-4" /> {quest.schema.tableName}</h4>
                  </div>
                  <ul className="space-y-1.5 text-sm">
                    {quest.schema.columns.map(col => (
                      <li key={col.name} className="flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
                        <span className="font-medium">{col.name}</span>
                        <span className="text-muted-foreground text-xs font-mono">{col.type}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </MainLayout>
  );
}
