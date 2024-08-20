'use server';

import { streamText } from 'ai';
import { AzureOpenAI } from "openai";
import { azure, createAzure } from '@ai-sdk/azure';
import { createStreamableValue } from 'ai/rsc';
import { EventSourceParserStream } from 'eventsource-parser/stream'
import { createParser, type ParsedEvent, type ReconnectInterval } from 'eventsource-parser'

export async function pf_score(input: string) {
    'use server';

    const stream = createStreamableValue('');

    function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
            console.log('data: %s', event.data)

            stream.update(event.data);
        } else if (event.type === 'reconnect-interval') {
            console.log('We should set reconnect interval to %d milliseconds', event.value)
        }
    }


    (async () => {
        try {
            const response = await fetch('https://promptflow-basic-rag-ca.ashyground-6701774e.eastus.azurecontainerapps.io/score', {
                method: 'POST',
                headers: {
                    'Accept': 'text/event-stream',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: input, chat_history: [] }),
            });

            if (!response.body) {
                throw new Error('Response does not have a body');
            }

            const decoder = new TextDecoder();
            const parser = createParser(onParse);
            const reader = response.body.getReader();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                parser.feed(chunk);
            }

            stream.done();
        } catch (error) {
            console.error('Error fetching or processing the stream:', error);
            stream.update('An error occurred while processing your request.');
            stream.done();
        }
    })();

    return { output: stream.value };
}