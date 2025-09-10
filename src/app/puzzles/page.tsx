
'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowDown, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialTables = {
  unnormalized: [
    {
      project_id: 'P101',
      project_name: 'Data Migration',
      employee_id: 'E501',
      employee_name: 'Alice',
      department_id: 'D01',
      department_name: 'Engineering',
    },
    {
      project_id: 'P101',
      project_name: 'Data Migration',
      employee_id: 'E502',
      employee_name: 'Bob',
      department_id: 'D01',
      department_name: 'Engineering',
    },
    {
      project_id: 'P102',
      project_name: 'Cloud Upgrade',
      employee_id: 'E501',
      employee_name: 'Alice',
      department_id: 'D01',
      department_name: 'Engineering',
    },
     {
      project_id: 'P103',
      project_name: 'UI Redesign',
      employee_id: 'E503',
      employee_name: 'Charlie',
      department_id: 'D02',
      department_name: 'Design',
    },
  ],
};

const normalizedTables = {
  projects: [
    { project_id: 'P101', project_name: 'Data Migration' },
    { project_id: 'P102', project_name: 'Cloud Upgrade' },
    { project_id: 'P103', project_name: 'UI Redesign' },
  ],
  employees: [
    { employee_id: 'E501', employee_name: 'Alice', department_id: 'D01' },
    { employee_id: 'E502', employee_name: 'Bob', department_id: 'D01' },
    { employee_id: 'E503', employee_name: 'Charlie', department_id: 'D02' },
  ],
  departments: [
    { department_id: 'D01', department_name: 'Engineering' },
    { department_id: 'D02', department_name: 'Design' },
  ],
  project_assignments: [
      {project_id: 'P101', employee_id: 'E501'},
      {project_id: 'P101', employee_id: 'E502'},
      {project_id: 'P102', employee_id: 'E501'},
      {project_id: 'P103', employee_id: 'E503'},
  ]
};

export default function PuzzlesPage() {
  const [showNormalized, setShowNormalized] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const checkSolution = () => {
    // Basic check for demonstration
    const isCorrect = true; // In a real scenario, this would involve logic
    if (isCorrect) {
        setFeedback({type: 'success', message: 'Great job! This is a valid way to normalize the data into 3NF.'});
    } else {
        setFeedback({type: 'error', message: 'Not quite. Think about removing transitive dependencies.'});
    }
  }


  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Normalization Puzzle: The Unwieldy Table</CardTitle>
            <CardDescription>
              This table contains redundant data and suffers from update anomalies. Your task is to normalize it to the Third Normal Form (3NF).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-2">Unnormalized Table: ProjectAssignments</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>project_id</TableHead>
                  <TableHead>project_name</TableHead>
                  <TableHead>employee_id</TableHead>
                  <TableHead>employee_name</TableHead>
                  <TableHead>department_id</TableHead>
                  <TableHead>department_name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialTables.unnormalized.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.project_id}</TableCell>
                    <TableCell>{row.project_name}</TableCell>
                    <TableCell>{row.employee_id}</TableCell>
                    <TableCell>{row.employee_name}</TableCell>
                    <TableCell>{row.department_id}</TableCell>
                    <TableCell>{row.department_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center text-center">
            <div className='flex flex-col gap-2 items-center'>
                <ArrowDown className="h-8 w-8 text-muted-foreground animate-bounce" />
                <p className="text-muted-foreground">Analyze the table above and consider how you would break it down.</p>
                <Button onClick={() => setShowNormalized(!showNormalized)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {showNormalized ? 'Hide' : 'Show'} Suggested Solution
                </Button>
            </div>
        </div>

        {showNormalized && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader>
                <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>project_id</TableHead>
                        <TableHead>project_name</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {normalizedTables.projects.map((row) => (
                        <TableRow key={row.project_id}>
                        <TableCell>{row.project_id}</TableCell>
                        <TableCell>{row.project_name}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Employees</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>employee_id</TableHead>
                        <TableHead>employee_name</TableHead>
                        <TableHead>department_id</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {normalizedTables.employees.map((row) => (
                        <TableRow key={row.employee_id}>
                        <TableCell>{row.employee_id}</TableCell>
                        <TableCell>{row.employee_name}</TableCell>
                        <TableCell>{row.department_id}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                <CardTitle>Departments</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>department_id</TableHead>
                        <TableHead>department_name</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {normalizedTables.departments.map((row) => (
                        <TableRow key={row.department_id}>
                        <TableCell>{row.department_id}</TableCell>
                        <TableCell>{row.department_name}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                <CardTitle>Project Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>project_id</TableHead>
                        <TableHead>employee_id</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {normalizedTables.project_assignments.map((row, i) => (
                        <TableRow key={i}>
                        <TableCell>{row.project_id}</TableCell>
                        <TableCell>{row.employee_id}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            </div>
        )}

        {showNormalized && (
          <Alert variant='default'>
            <Sparkles className="h-4 w-4" />
            <AlertTitle>This is one possible solution!</AlertTitle>
            <AlertDescription>
              This solution correctly separates entities into their own tables (Projects, Employees, Departments) and uses a linking table (Project Assignments) to manage the many-to-many relationship between them, achieving Third Normal Form (3NF).
            </AlertDescription>
          </Alert>
        )}
      </div>
    </MainLayout>
  );
}
