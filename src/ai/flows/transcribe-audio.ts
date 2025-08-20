// src/ai/flows/transcribe-audio.ts
'use server';
/**
 * @fileOverview Transcribes audio to text.
 *
 * - transcribeAudio - A function that takes audio data and returns the transcribed text.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {generate} from 'genkit';

const TranscribeAudioInputSchema = z.object({
    audioDataUri: z.string().describe(
        "A chunk of audio as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

const TranscribeAudioOutputSchema = z.object({
  text: z.string().describe('The transcribed text from the audio.'),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;


export async function transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}


const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async ({ audioDataUri }) => {
    const { text } = await generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: [
        {
          text: 'Transcribe the following audio. The audio is from one turn in an interview. Only return the transcribed text.',
        },
        { media: { url: audioDataUri } },
      ],
    });

    return { text: text || '' };
  }
);
