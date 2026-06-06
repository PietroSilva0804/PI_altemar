'use server';

/**
 * @fileOverview Flow to generate realistic product reviews.
 *
 * - generateProductReviews: Generates a list of reviews for a given product.
 * - GenerateProductReviewsInput: Input schema for the flow.
 * - GenerateProductReviewsOutput: Output schema for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the schema for a single product review
const ProductReviewSchema = z.object({
  userName: z.string().describe('O nome do usuário que fez a avaliação (ex: "Maria S.", "João P.").'),
  rating: z.number().min(1).max(5).describe('A nota em estrelas, de 1 a 5.'),
  comment: z.string().describe('O comentário da avaliação, refletindo a nota dada.'),
});
export type ProductReview = z.infer<typeof ProductReviewSchema>;

// Define the input schema for the main flow
const GenerateProductReviewsInputSchema = z.object({
  productName: z.string().describe('O nome do produto a ser avaliado.'),
  productCategory: z.string().describe('A categoria do produto.'),
});
export type GenerateProductReviewsInput = z.infer<typeof GenerateProductReviewsInputSchema>;

// Define the output schema for the main flow
const GenerateProductReviewsOutputSchema = z.object({
  reviews: z.array(ProductReviewSchema).describe('Uma lista de 5 a 10 avaliações de produtos.'),
  averageRating: z.number().describe('A média das notas de todas as avaliações geradas.'),
});
export type GenerateProductReviewsOutput = z.infer<typeof GenerateProductReviewsOutputSchema>;


export async function generateProductReviews(
  input: GenerateProductReviewsInput
): Promise<GenerateProductReviewsOutput> {
  return generateProductReviewsFlow(input);
}


const prompt = ai.definePrompt({
    name: 'generateProductReviewsPrompt',
    input: { schema: GenerateProductReviewsInputSchema },
    output: { schema: GenerateProductReviewsOutputSchema },
    prompt: `Você é um especialista em e-commerce encarregado de criar dados de avaliação realistas para um marketplace.

    Sua tarefa é gerar de 5 a 10 avaliações para o seguinte produto:
    - Nome do Produto: {{{productName}}}
    - Categoria: {{{productCategory}}}

    **REGRAS IMPORTANTES:**
    1.  **Seja Realista:** Crie uma mistura de avaliações. Nem todo mundo dá 5 estrelas. Inclua avaliações de 3, 4 e 5 estrelas. Ocasionalmente, inclua uma avaliação de 1 ou 2 estrelas se fizer sentido para um possível defeito ou problema.
    2.  **Comentários Coerentes:** O texto do comentário DEVE ser condizente com a nota.
        -   **5 estrelas:** Elogios, entusiasmo, recomendação forte. (Ex: "Amei! Qualidade incrível e entrega rápida.")
        -   **4 estrelas:** Positivo, mas com um pequeno ponto de melhoria. (Ex: "Muito bom, mas a cor era um pouco diferente da foto.")
        -   **3 estrelas:** Neutro. O produto é "ok", mas não superou as expectativas. (Ex: "É um bom produto, mas demorou para chegar.")
        -   **1-2 estrelas:** Crítica clara sobre um problema (qualidade, entrega, atendimento). (Ex: "Decepcionado, o produto chegou quebrado.")
    3.  **Nomes de Usuário:** Use nomes brasileiros comuns seguidos de uma inicial de sobrenome (ex: "Ana C.", "Pedro L.", "Mariana F.").
    4.  **Calcular Média:** Após gerar as avaliações, calcule a média exata das notas e preencha o campo 'averageRating'.

    Gere a resposta estritamente no formato JSON solicitado.
    `,
});


const generateProductReviewsFlow = ai.defineFlow(
  {
    name: 'generateProductReviewsFlow',
    inputSchema: GenerateProductReviewsInputSchema,
    outputSchema: GenerateProductReviewsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    
    // Ensure there's an output before proceeding.
    if (!output) {
      throw new Error("AI did not produce an output.");
    }
    
    // Recalculate average rating for accuracy, in case the model made a mistake.
    if (output.reviews && output.reviews.length > 0) {
      const sum = output.reviews.reduce((acc, review) => acc + review.rating, 0);
      const average = sum / output.reviews.length;
      // Round to one decimal place
      output.averageRating = Math.round(average * 10) / 10;
    } else {
      output.averageRating = 0;
    }

    return output;
  }
);
