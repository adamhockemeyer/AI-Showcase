'use server';

import { streamText } from 'ai';
import { AzureOpenAI } from "openai";
import { azure, createAzure } from '@ai-sdk/azure';
import { createStreamableValue } from 'ai/rsc';

export async function generate(input: string) {
    'use server';

    const stream = createStreamableValue('');

    const azure = createAzure({
        baseURL: `${process.env.AZURE_OPENAI_BASE_URL}openai/deployments/`,
        apiKey: process.env.AZURE_OPENAI_API_KEY,
    });


    (async () => {
        const { textStream } = await streamText({
            model: azure(process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'),
            prompt: input,
            headers: {
                "x-vercel-ai-data-stream": "v1",
            }
        });

        for await (const delta of textStream) {
            stream.update(delta);
        }

        stream.done();
    })();

    return { output: stream.value };
}

export async function generateImage(prompt: string) {
    // The number of images to generate
    const n = 1;
    const size = "1024x1024";

    const deployment = "dall-e-3";
    const apiVersion = "2024-04-01-preview";

    const client = new AzureOpenAI({ endpoint: process.env.AZURE_OPENAI_BASE_URL, apiKey: process.env.AZURE_OPENAI_API_KEY, deployment, apiVersion });

    console.log(client);

    const results = await client.images.generate({ prompt, model: "", n, size });
    return results.data;

}