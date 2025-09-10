'use server';

/**
 * @fileOverview Validates a user's SQL query against the requirements of a specific quest.
 *
 * - validateSQLQuery - A function that validates the SQL query.
 * - ValidateSQLQueryInput - The input type for the validateSQLQuery function.
 * - ValidateSQLQueryOutput - The return type for the validateSQLQuery function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ValidateSQLQueryInputSchema = z.object({
  userQuery: z.string().describe("The SQL query written by the user."),
  questDescription: z.string().describe("The description of the quest/problem the user is trying to solve."),
  tableSchema: z.string().describe("The schema of the database table(s) relevant to the quest."),
  isCustomQuest: z.boolean().optional().describe("A flag to indicate if this is a custom quest based on user-uploaded data.")
});
export type ValidateSQLQueryInput = z.infer<typeof ValidateSQLQueryInputSchema>;


const ValidateSQLQueryOutputSchema = z.object({
  isCorrect: z.boolean().describe("Whether the user's query correctly solves the quest."),
  feedback: z.string().describe("Constructive feedback for the user. If the query is correct, provide a confirmation message. If incorrect, provide a hint or explain the mistake without giving the direct answer."),
  simulatedResult: z.string().optional().describe("If the query is correct and it is a custom quest, provide a sample result set in JSON array format. The result should be plausible based on the query and schema. Example: '[{\"column1\":\"value1\", \"column2\":123}]'"),
});
export type ValidateSQLQueryOutput = z.infer<typeof ValidateSQLQueryOutputSchema>;


export async function validateSQLQuery(input: ValidateSQLQueryInput): Promise<ValidateSQLQueryOutput> {
  return validateSQLQueryFlow(input);
}


const prompt = ai.definePrompt({
  name: 'validateSQLQueryPrompt',
  input: { schema: ValidateSQLQueryInputSchema },
  output: { schema: ValidateSQLQueryOutputSchema },
  prompt: `You are an expert SQL instructor. Your task is to validate a user's SQL query based on a specific quest's requirements.

Quest Description:
{{{questDescription}}}

Table Schema:
{{{tableSchema}}}

User's SQL Query:
\`\`\`sql
{{{userQuery}}}
\`\`\`

Analyze the user's query.
1. Determine if it correctly and efficiently solves the problem described in the quest description. The query does not need to be an exact string match of a "perfect" answer, but it must be functionally correct.
2. If the query is correct, set isCorrect to true and provide a positive feedback message.
3. If the query is incorrect, set isCorrect to false and provide a concise, helpful hint that guides the user toward the correct solution. Do not give away the answer.
4. If this is a custom quest (isCustomQuest is true) AND the query is correct, generate a small, realistic, simulated result set that the query would produce. This result MUST be a valid JSON array of objects. For example: '[{"name":"John Doe", "age":30}, {"name":"Jane Smith", "age":25}]'. If it's not a custom quest or the query is incorrect, leave simulatedResult empty.

Provide your response in JSON format.`,
});


const validateSQLQueryFlow = ai.defineFlow(
  {
    name: 'validateSQLQueryFlow',
    inputSchema: ValidateSQLQueryInputSchema,
    outputSchema: ValidateSQLQueryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
