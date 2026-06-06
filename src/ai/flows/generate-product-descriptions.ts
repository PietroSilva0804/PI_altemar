'use server';

/**
 * @fileOverview Flow to generate compelling product descriptions from a title and keywords.
 * This is a simulated flow and does not require an API key.
 *
 * - generateProductDescription - A function that handles the product description generation.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the product.'),
  keywords: z.string().describe('Comma-separated keywords related to the product.'),
});
export type GenerateProductDescriptionInput = z.infer<
  typeof GenerateProductDescriptionInputSchema
>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<
  typeof GenerateProductDescriptionOutputSchema
>;

export async function generateProductDescription(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

// This is a simulated flow that generates a product description without calling a real AI model.
// It combines the inputs into a structured description.
const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async ({ title, keywords }) => {
    const templates = [
      `Descubra o(a) incrível ${title}, um produto artesanal feito com paixão e cuidado. Perfeito para quem valoriza ${keywords.split(',')[0].trim()}, este item se destaca pela sua qualidade e design exclusivo. Ideal para ${keywords.split(',')[1]?.trim() || 'qualquer ocasião'}, é a escolha certa para presentear ou se mimar.`,
      `Apresentamos o(a) ${title}, a combinação perfeita de tradição e modernidade. Feito com materiais de alta qualidade, este produto é ideal para quem busca ${keywords.split(',')[0].trim()}. Seus detalhes, pensados para ${keywords.split(',')[1]?.trim() || 'surpreender'}, fazem dele um item indispensável.`,
      `Feito para encantar, o(a) ${title} é mais que um simples produto, é uma experiência. Com foco em ${keywords.split(',')[0].trim()}, cada peça é única. É o presente ideal para ${keywords.split(',')[1]?.trim() || 'amigos e família'}, adicionando um toque de originalidade ao dia a dia.`,
    ];

    // Select a random template to give some variation
    const description = templates[Math.floor(Math.random() * templates.length)];
    
    return { description };
  }
);
