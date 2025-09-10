'use server';

/**
 * @fileOverview Generates a SQL quest from a given table schema.
 *
 * - generateSqlQuestFromSchema - A function that creates a SQL quest.
 */

import { ai } from '@/ai/genkit';
import { GenerateSqlQuestFromSchemaInputSchema, GeneratedQuestSchema, type GeneratedQuest, type GenerateSqlQuestFromSchemaInput } from '@/lib/types/quests';

export async function generateSqlQuestFromSchema(input: GenerateSqlQuestFromSchemaInput): Promise<GeneratedQuest> {
    return generateSqlQuestFlow(input);
}


const prompt = ai.definePrompt({
    name: 'generateSqlQuestFromSchemaPrompt',
    input: { schema: GenerateSqlQuestFromSchemaInputSchema },
    output: { schema: GeneratedQuestSchema },
    prompt: `You are an expert SQL instructor who creates fun, themed quests for students. Your task is to generate a SQL quest based on a given table schema and a topic.

The quest should be a simple challenge that a beginner can solve.

Table Schema:
\`\`\`
{{{tableSchema}}}
\`\`\`

Quest Topic:
"{{{topic}}}"

Based on the schema and topic, generate a quest with:
1. A creative title.
2. A long description (1-2 sentences) that sets up a small story and clearly states the user's task.

For example, if the topic is "Filtering with WHERE" and the table is about employees, a good quest would be: "The manager needs a list of all employees in the 'Sales' department. Write a query to select all columns for employees whose department is 'Sales'."

Do not provide the SQL query itself in your response. Just provide the title and the description.

Provide your response in the specified JSON format.`,
});


const generateSqlQuestFlow = ai.defineFlow(
    {
        name: 'generateSqlQuestFlow',
        inputSchema: GenerateSqlQuestFromSchemaInputSchema,
        outputSchema: GeneratedQuestSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
