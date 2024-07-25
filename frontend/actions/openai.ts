'use server';

import { streamText } from 'ai';
//import { openai } from '@ai-sdk/openai';
//import { azure } from '@ai-sdk/azure';
import { createAzure } from '@ai-sdk/azure';
import { createStreamableValue } from 'ai/rsc';

export async function generate(input: string) {
    'use server';

    const stream = createStreamableValue('');

    const azure = createAzure({
        baseURL: process.env.AZURE_OPENAI_BASE_URL,
        apiKey: process.env.AZURE_OPENAI_API_KEY,
    });


    (async () => {
        const { textStream } = await streamText({
            model: azure(process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'),
            prompt: input,
        });

        for await (const delta of textStream) {
            stream.update(delta);
        }

        stream.done();
    })();

    return { output: stream.value };
}