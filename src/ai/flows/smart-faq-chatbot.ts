'use server';

/**
 * @fileOverview This file defines a Genkit flow for a smart FAQ chatbot.
 *
 * - smartFAQChatbot: A function that processes user queries and returns answers from FAQs.
 * - SmartFAQChatbotInput: The input type for the smartFAQChatbot function.
 * - SmartFAQChatbotOutput: The return type for the smartFAQChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartFAQChatbotInputSchema = z.object({
  query: z.string().describe('The user query to be answered by the chatbot.'),
  faq: z.string().optional().describe('Optional context (e.g. product details or platform FAQs) the assistant should prioritize when relevant.'),
});
export type SmartFAQChatbotInput = z.infer<typeof SmartFAQChatbotInputSchema>;

const SmartFAQChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
});
export type SmartFAQChatbotOutput = z.infer<typeof SmartFAQChatbotOutputSchema>;

export async function smartFAQChatbot(input: SmartFAQChatbotInput): Promise<SmartFAQChatbotOutput> {
  return smartFAQChatbotFlow(input);
}

const prompt = ai.definePrompt({
    name: 'smartFAQChatbotPrompt',
    input: { schema: SmartFAQChatbotInputSchema },
    output: { schema: SmartFAQChatbotOutputSchema },
    prompt: `You are "Léo", a friendly and knowledgeable AI assistant for "Empreenda+", an e-commerce platform for Brazilian micro-entrepreneurs (MEIs). You help both buyers and sellers.

    **YOUR JOB:**
    -   Answer ANY question the user asks, helpfully and accurately — about a specific product, the platform, becoming a MEI/seller, e-commerce in general, or general knowledge.
    -   When context is provided below (product details or FAQs), prioritize it and base specific facts (prices, policies, product specs) strictly on that context. Do not invent product-specific details that aren't in the context.
    -   When there is no context, or the question is general, answer from your own knowledge.
    -   If you genuinely don't know something, say so honestly and suggest a next step.

    **COMMUNICATION STYLE:**
    -   Tone: encouraging, friendly, clear.
    -   Keep answers concise and direct.
    -   Always answer in Brazilian Portuguese (pt-BR).

    {{#if faq}}
    **CONTEXT (prioritize this for specific facts):**
    {{{faq}}}
    {{/if}}

    Now answer the user's question.

    User Query: {{{query}}}
    `,
});

const smartFAQChatbotFlow = ai.defineFlow(
  {
    name: 'smartFAQChatbotFlow',
    inputSchema: SmartFAQChatbotInputSchema,
    outputSchema: SmartFAQChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
