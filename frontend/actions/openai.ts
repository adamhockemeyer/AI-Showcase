'use server';

import { z } from 'zod';
import { streamText, tool } from 'ai';
import { AzureOpenAI } from "openai";
import { azure, createAzure } from '@ai-sdk/azure';
import { createStreamableValue } from 'ai/rsc';
import { hostname } from 'os';

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

export async function generate_with_bing_search_tool(input: string, domain: string) {
    'use server';

    const stream = createStreamableValue('');

    const azure = createAzure({
        baseURL: `${process.env.AZURE_OPENAI_BASE_URL}openai/deployments/`,
        apiKey: process.env.AZURE_OPENAI_API_KEY
    });


    (async () => {
        const { textStream, toolResults } = await streamText({
            model: azure(process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'),
            system: `You are an AI assistant that is available to use on a website ${hostname}. The user knows they are already currently on this website. You should respond as if you are built into the website, and have knoweldge of the website. You should not refer to the website like it is a seperate identity, you are the website. If you do not have information for the user, you should make a tool call. If you perform any tool calls, ensure you summarize the final response to the user. Additionaly, summarize any actions performed to get to your answer.`,
            prompt: input,
            toolChoice: 'auto',
            maxSteps: 5,
            tools: {
                bing_search: tool({
                    description: 'Searches the web for more information for the given website and query.',
                    parameters: z.object({
                        query: z.string().describe('The users question to search for.')
                    }),
                    execute: async ({ query }) => {

                        console.log('Searching Bing for:', query);

                        const hostname = new URL(domain).hostname;

                        const response = await fetch(`https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query + ' site:' + hostname)}&mkt=en-US`, {
                            method: 'GET',
                            headers: {
                                'Ocp-Apim-Subscription-Key': process.env.BING_SEARCH_API_KEY || 'NOT_SET'
                            }
                        });

                        const data = await response.json();

                        const results = data.webPages?.value.map((page: any) => page);

                        console.log('bing_search Tool Results:', results);

                        //return data.webPages.value.map((page: any) => page.snippet);

                        return results;
                    }
                }),
            },
            headers: {
                "x-vercel-ai-data-stream": "v1",
            },
            onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
                // your own logic, e.g. for saving the chat history or recording usage
                //console.log('Step finished:', { text, toolCalls, toolResults, finishReason, usage });

                toolResults.forEach((toolResults) => {
                    //console.log(toolResults.result)
                    // If you want to update the stream with the Bing Search results directly
                    //stream.update(`This is what we found from Bing Search: //n${toolResults.result.map((page: any) => page.snippet).join(' //n')}`);
                });
            },
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