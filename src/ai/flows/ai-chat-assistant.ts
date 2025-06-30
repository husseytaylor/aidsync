'use server';

/**
 * @fileOverview Implements the AI chat assistant flow for the AidSync platform.
 *
 * - aiChatAssistant - A function that handles user interactions with the AI chat assistant.
 * - AIChatAssistantInput - The input type for the aiChatAssistant function.
 * - AIChatAssistantOutput - The return type for the aiChatAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatAssistantInputSchema = z.object({
  message: z.string().describe('The user message to the AI chat assistant.'),
});
export type AIChatAssistantInput = z.infer<typeof AIChatAssistantInputSchema>;

const AIChatAssistantOutputSchema = z.object({
  response: z.string().describe('The AI chat assistant response to the user message.'),
});
export type AIChatAssistantOutput = z.infer<typeof AIChatAssistantOutputSchema>;

export async function aiChatAssistant(input: AIChatAssistantInput): Promise<AIChatAssistantOutput> {
  return aiChatAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatAssistantPrompt',
  input: {schema: AIChatAssistantInputSchema},
  output: {schema: AIChatAssistantOutputSchema},
  prompt: `You are an AI assistant for AidSync, a company that provides white-labeled AI automation systems for growing businesses. 
  
Your primary goal is to answer questions about our services, pricing, and processes, and then guide users to book a discovery call.

Use the official AidSync knowledge base to answer user questions accurately.

If a question is too complex, technical, or out of scope, politely direct the user to book a discovery call to speak with a human team member for more detailed information. Do not attempt to answer questions you don't have information for.

User Message: {{{message}}}`,
});

const aiChatAssistantFlow = ai.defineFlow(
  {
    name: 'aiChatAssistantFlow',
    inputSchema: AIChatAssistantInputSchema,
    outputSchema: AIChatAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
