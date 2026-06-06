'use server';

/**
 * @fileOverview Verifies MEI (Microentrepreneur) details against public records.
 *
 * - verifyMeiDetails - A function that verifies MEI details.
 * - VerifyMeiDetailsInput - The input type for the verifyMeiDetails function.
 * - VerifyMeiDetailsOutput - The return type for the verifyMeiDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyMeiDetailsInputSchema = z.object({
  cnpj: z.string().describe('The CNPJ (company ID) of the MEI.'),
  address: z.string().describe('The address of the MEI.'),
});
export type VerifyMeiDetailsInput = z.infer<typeof VerifyMeiDetailsInputSchema>;

const VerifyMeiDetailsOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the MEI details are valid.'),
  verificationDetails: z
    .string()
    .describe('Details of the verification process and any discrepancies found.'),
});
export type VerifyMeiDetailsOutput = z.infer<typeof VerifyMeiDetailsOutputSchema>;

export async function verifyMeiDetails(input: VerifyMeiDetailsInput): Promise<VerifyMeiDetailsOutput> {
  return verifyMeiDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyMeiDetailsPrompt',
  input: {schema: VerifyMeiDetailsInputSchema},
  output: {schema: VerifyMeiDetailsOutputSchema},
  prompt: `You are an expert in verifying MEI (Microentrepreneur) details against public records.

You will receive the CNPJ and address of an MEI.

CNPJ: {{{cnpj}}}
Address: {{{address}}}

Determine if the provided details are valid and consistent with public records. Provide details of the verification process and any discrepancies found.
`,
});

const verifyMeiDetailsFlow = ai.defineFlow(
  {
    name: 'verifyMeiDetailsFlow',
    inputSchema: VerifyMeiDetailsInputSchema,
    outputSchema: VerifyMeiDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
