'use server';

import { streamText } from 'ai';
//import { openai } from '@ai-sdk/openai';
//import { azure } from '@ai-sdk/azure';
import { createAzure } from '@ai-sdk/azure';
import { createStreamableValue } from 'ai/rsc';


export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export async function continueConversation(history: Message[]) {
    'use server';

    const azure = createAzure({
        baseURL: process.env.AZURE_OPENAI_BASE_URL,
        apiKey: process.env.AZURE_OPENAI_API_KEY,
    });


    const stream = createStreamableValue();

    (async () => {
        const { textStream } = await streamText({
            model: azure(process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'),
            system:
                "You are a dude that doesn't drop character until the DVD commentary.",
            messages: history,
        });

        for await (const text of textStream) {
            stream.update(text);
        }

        stream.done();
    })();

    return {
        messages: history,
        newMessage: stream.value,
    };
}



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