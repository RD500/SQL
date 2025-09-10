'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, Upload, Loader2, TableIcon, Pilcrow, Sparkles, Wand } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeCsvData } from '@/ai/flows/analyze-csv-data';
import { generateSqlQuestFromSchema } from '@/ai/flows/generate-sql-quest-from-schema';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import type { Quest } from '@/lib/types/quests';

type CsvAnalysis = {
  columnSchema: {
    columnName: string;
    dataType: string;
    description: string;
  }[];
  dataSummary: string;
  sampleRows: Record<string, any>[];
  tableName: string;
};

// Basic CSV string to array of objects parser
function parseCsvString(csvString: string): Record<string, any>[] {
    const lines = csvString.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        // More robust CSV parsing to handle commas inside quoted strings
        const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/"/g, ''));
        const rowObject: Record<string, any> = {};
        for (let j = 0; j < headers.length; j++) {
            rowObject[headers[j]] = values[j] || '';
        }
        rows.push(rowObject);
    }
    return rows;
}


export default function ExplorePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingQuest, setIsGeneratingQuest] = useState(false);
  const [analysis, setAnalysis] = useState<CsvAnalysis | null>(null);
  const { toast } = useToast();
  const router = useRouter();


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a CSV file.',
        });
        return;
      }
      setFile(selectedFile);
      setAnalysis(null);
    }
  };

  const handleAnalyzeData = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a CSV file to analyze.',
      });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const dataUri = reader.result as string;
        try {
          const result = await analyzeCsvData({ csvDataUri: dataUri });
          const sampleRows = parseCsvString(result.sampleRowsCsv);
          const tableName = file.name.replace('.csv', '').replace(/[^a-zA-Z0-9]/g, '_');
          setAnalysis({
              columnSchema: result.columnSchema,
              dataSummary: result.dataSummary,
              sampleRows: sampleRows,
              tableName: tableName,
          });
        } catch (error) {
          console.error('Error analyzing data:', error);
          toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description:
              'There was a problem analyzing your file. Please check the file format and try again.',
          });
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = (error) => {
        console.error('File reading error:', error);
        toast({
          variant: 'destructive',
          title: 'File Read Error',
          description: 'Could not read the selected file.',
        });
        setIsLoading(false);
      };
    } catch (error) {
      console.error('Error setting up file reader:', error);
      setIsLoading(false);
    }
  };

  const handleGenerateQuest = async () => {
    if (!analysis) return;
    setIsGeneratingQuest(true);

    try {
        const tableSchema = `Table: ${analysis.tableName}\nColumns: ${analysis.columnSchema.map(c => `${c.columnName} (${c.dataType})`).join(', ')}`;

        const generatedQuest = await generateSqlQuestFromSchema({
            tableSchema,
            topic: 'Filtering with WHERE clause'
        });

        const customQuest: Quest = {
            id: 'custom-quest',
            title: generatedQuest.title,
            description: `A custom quest for your '${analysis.tableName}' table.`,
            longDescription: generatedQuest.longDescription,
            difficulty: 'Beginner',
            category: 'Custom Quest',
            initialQuery: `SELECT * FROM ${analysis.tableName};`,
            correctQuery: '', // AI will validate logic, not a specific string
            successMessage: 'You have successfully solved the challenge for your custom data!',
            schema: {
                tableName: analysis.tableName,
                columns: analysis.columnSchema.map(c => ({ name: c.columnName, type: c.dataType })),
            },
            resultData: [], // We won't show result data for custom quests yet
        };

        // Store quest in session storage and navigate
        sessionStorage.setItem('customQuest', JSON.stringify(customQuest));
        router.push('/quests/custom-quest');

    } catch (error) {
        console.error('Error generating quest:', error);
        toast({
            variant: 'destructive',
            title: 'Quest Generation Failed',
            description: 'The AI could not create a quest at this time. Please try again.',
        });
    } finally {
        setIsGeneratingQuest(false);
    }
  }

  const handleUploadClick = () => {
    document.getElementById('csv-upload')?.click();
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Explore Your Data</h1>
          <p className="text-muted-foreground">
            Upload a CSV dataset to analyze its schema and generate custom SQL quests.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload & Analyze</CardTitle>
            <CardDescription>Select a CSV file from your computer to begin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex flex-col sm:flex-row items-center gap-4 p-6 border-2 border-dashed rounded-lg">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Upload className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <h3 className="font-semibold">{file ? file.name : 'No file selected'}</h3>
                  <p className="text-xs text-muted-foreground">
                    {file ? `${(file.size / 1024).toFixed(2)} KB` : 'Please select a CSV file.'}
                  </p>
                </div>
                <input type="file" id="csv-upload" accept=".csv" onChange={handleFileChange} className="hidden" />
                <Button onClick={handleUploadClick} variant="outline" disabled={isLoading}>
                    <FileUp className="mr-2 h-4 w-4" />
                    Select File
                </Button>
             </div>
             <Button onClick={handleAnalyzeData} disabled={isLoading || !file}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Analyze Dataset
            </Button>
          </CardContent>
        </Card>

        {isLoading && (
            <Card className="flex items-center justify-center p-12">
                <Loader2 className="mr-4 h-8 w-8 animate-spin" />
                <p className="text-muted-foreground">AI is analyzing your data...</p>
            </Card>
        )}

        {analysis && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <TableIcon />
                    Detected Schema: {analysis.tableName}
                </CardTitle>
                <CardDescription>
                  Here is the schema the AI detected from your CSV file. You can now generate a quest based on it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column Name</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.columnSchema.map((col) => (
                      <TableRow key={col.columnName}>
                        <TableCell className="font-medium">{col.columnName}</TableCell>
                        <TableCell>{col.dataType}</TableCell>
                        <TableCell>{col.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
               <CardContent>
                <Button onClick={handleGenerateQuest} disabled={isGeneratingQuest}>
                    {isGeneratingQuest ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Wand className="mr-2 h-4 w-4" />
                    )}
                    Generate Quest
                </Button>
               </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Pilcrow />
                    AI Data Summary
                </CardTitle>
                <CardDescription>A quick summary of your dataset's contents.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{analysis.dataSummary}</p>
                <h4 className="font-semibold">Sample Data</h4>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {analysis.sampleRows.length > 0 && Object.keys(analysis.sampleRows[0]).map(key => <TableHead key={key}>{key}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {analysis.sampleRows.map((row, index) => (
                            <TableRow key={index}>
                                {Object.values(row).map((value, i) => <TableCell key={i}>{String(value)}</TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
