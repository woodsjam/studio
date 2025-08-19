// src/ai/flows/detect-timing-anomalies.ts
'use server';
/**
 * @fileOverview Detects timing anomalies during an interview session.
 *
 * - detectTimingAnomalies - A function that analyzes turn timings and flags unusual pauses or response times.
 * - DetectTimingAnomaliesInput - The input type for the detectTimingAnomalies function, including session ID.
 * - DetectTimingAnomaliesOutput - The return type for the detectTimingAnomalies function, indicating any detected anomalies.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectTimingAnomaliesInputSchema = z.object({
  sessionId: z.string().describe('The ID of the interview session to analyze.'),
  turns: z.array(
    z.object({
      qId: z.string().describe('The question ID for this turn.'),
      idx: z.number().describe('The index of this turn.'),
      startedAt: z.number().describe('The timestamp when the turn started.'),
      endedAt: z.number().describe('The timestamp when the turn ended.'),
    })
  ).describe('An array of turn objects with timing information.'),
});
export type DetectTimingAnomaliesInput = z.infer<typeof DetectTimingAnomaliesInputSchema>;

const DetectTimingAnomaliesOutputSchema = z.object({
  anomalies: z.array(
    z.object({
      turnId: z.string().describe('The ID of the turn with the timing anomaly.'),
      reason: z.string().describe('The reason for flagging the anomaly.'),
    })
  ).describe('An array of detected timing anomalies, if any.'),
});
export type DetectTimingAnomaliesOutput = z.infer<typeof DetectTimingAnomaliesOutputSchema>;

export async function detectTimingAnomalies(input: DetectTimingAnomaliesInput): Promise<DetectTimingAnomaliesOutput> {
  return detectTimingAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectTimingAnomaliesPrompt',
  input: {schema: DetectTimingAnomaliesInputSchema},
  output: {schema: DetectTimingAnomaliesOutputSchema},
  prompt: `You are an AI assistant specializing in detecting timing anomalies during interview sessions.

  Analyze the provided interview turns to identify any unusual pauses or response time patterns that may indicate potential issues.

  Consider factors such as unusually long pauses before answering, excessively short response times, or significant variations in response times compared to the average.

  Provide clear reasons for flagging any identified anomalies.

  Here are the interview turns:
  {{#each turns}}
  Turn ID: {{qId}}, Index: {{idx}}, Started At: {{startedAt}}, Ended At: {{endedAt}}
  {{/each}}
  `,
});

const detectTimingAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectTimingAnomaliesFlow',
    inputSchema: DetectTimingAnomaliesInputSchema,
    outputSchema: DetectTimingAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
