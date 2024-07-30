import { createAzure } from '@ai-sdk/azure';
import { convertToCoreMessages, streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const azure = createAzure({
        baseURL: process.env.AZURE_OPENAI_BASE_URL,
        apiKey: process.env.AZURE_OPENAI_API_KEY,
    });

    const result = await streamText({
        model: azure(process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'),
        system: 'You are a helpful assistant.',
        messages: convertToCoreMessages(messages),
    });

    return result.toAIStreamResponse();
}