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
  faq: z.string().describe('Frequently asked questions and their answers to be used as context. In this case, it will be the details of a specific product.'),
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
    prompt: `You are "Léo", a friendly and expert AI sales assistant for "Empreenda+", an e-commerce platform for Brazilian micro-entrepreneurs. Your mission is to provide helpful, clear, and encouraging answers to user questions about a specific product.

    **IMPORTANT RULES:**
    1.  **Use ONLY the Provided Context:** Your entire knowledge base for the product is the context provided below under "Product Details". You MUST base your answers strictly on this information. Do not invent details, prices, or policies.
    2.  **Stay On-Topic:** Only answer questions related to the product in the context. If the user asks something unrelated (e.g., about other products, the weather, or personal questions), you MUST politely decline. Your response in such cases should be: "Desculpe, só posso responder a perguntas sobre este produto. Como posso ajudar com ele?"
    3.  **Be a Helpful Sales Assistant:** Your goal is to help the user understand the product and feel confident about purchasing it. Be positive and highlight the product's qualities based on the description.

    **COMMUNICATION STYLE:**
    -   Your tone should always be encouraging, friendly, and clear.
    -   Keep answers concise and direct.
    -   Use Brazilian Portuguese (pt-BR).

    **CONTEXT: PRODUCT DETAILS**
    This is the only information you have about the product. Use it to answer the user's query.
    {{{faq}}}

    Now, please answer the following user query, strictly following all the rules above.

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
