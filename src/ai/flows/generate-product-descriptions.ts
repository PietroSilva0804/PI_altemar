'use server';

/**
 * @fileOverview Flow to generate compelling product descriptions from a title and keywords.
 * Uses Gemini when an API key is available, with a template-based fallback otherwise.
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

function fallbackDescription(title: string, keywords: string): string {
  const parts = keywords.split(',');
  const first = parts[0]?.trim() || 'qualidade';
  const second = parts[1]?.trim() || 'qualquer ocasião';
  const templates = [
    `Descubra o(a) incrível ${title}, um produto artesanal feito com paixão e cuidado. Perfeito para quem valoriza ${first}, este item se destaca pela sua qualidade e design exclusivo. Ideal para ${second}, é a escolha certa para presentear ou se mimar.`,
    `Apresentamos o(a) ${title}, a combinação perfeita de tradição e modernidade. Feito com materiais de alta qualidade, este produto é ideal para quem busca ${first}. Seus detalhes, pensados para ${second}, fazem dele um item indispensável.`,
    `Feito para encantar, o(a) ${title} é mais que um simples produto, é uma experiência. Com foco em ${first}, cada peça é única. É o presente ideal para ${second}, adicionando um toque de originalidade ao dia a dia.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `Você é um especialista em copywriting de e-commerce para microempreendedores brasileiros.

Escreva uma descrição de produto atraente, calorosa e persuasiva em português do Brasil, com 2 a 4 frases. Não use markdown, listas ou emojis.

Título do produto: {{{title}}}
Palavras-chave: {{{keywords}}}`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async ({title, keywords}) => {
    const hasApiKey =
      !!process.env.GEMINI_API_KEY ||
      !!process.env.GOOGLE_API_KEY ||
      !!process.env.GOOGLE_GENAI_API_KEY;

    if (!hasApiKey) {
      return {description: fallbackDescription(title, keywords)};
    }

    try {
      const {output} = await prompt({title, keywords});
      if (output?.description) {
        return {description: output.description};
      }
      return {description: fallbackDescription(title, keywords)};
    } catch (error) {
      console.error('AI description generation failed, using fallback:', error);
      return {description: fallbackDescription(title, keywords)};
    }
  }
);
