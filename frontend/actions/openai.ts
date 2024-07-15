'use server';

import { streamText } from 'ai';
//import { openai } from '@ai-sdk/openai';
import { azure } from '@ai-sdk/azure';
import { createStreamableValue } from 'ai/rsc';

export async function generate(input: string) {
    'use server';

    const stream = createStreamableValue('');

    (async () => {
        const { textStream } = await streamText({
            model: azure('gpt-4'),
            prompt: input,
        });

        for await (const delta of textStream) {
            stream.update(delta);
        }

        stream.done();
    })();

    return { output: stream.value };
}