"use server";

import { createOllama } from "ollama-ai-provider";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

export interface Message {
    role: "user" | "assistant";
    content: string;
}

export async function continueConversation(input: string) {
    "use server";

    const stream = createStreamableValue();
    const ollama = createOllama({
        // custom settings
        baseURL: `${process.env.OLLAMA_PHI3MEDIUM_URL}/api`
    });
    const model = ollama("phi3:medium");

    (async () => {
        const { textStream } = await streamText({
            model: model,
            //messages: history,
            prompt: input,
        });

        for await (const text of textStream) {
            stream.update(text);
        }

        stream.done();
    })();

    return {ouput: stream.value};
}