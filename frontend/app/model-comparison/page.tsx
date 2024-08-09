"use client"

import { generateImage } from "@/actions/openai"
import { useState } from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { generate } from "@/actions/openai"
import { continueConversation, Message } from "@/actions/ollama"
import { readStreamableValue } from 'ai/rsc';
import { Stream } from "stream"
import ReactMarkdown from 'react-markdown';

export default function Component() {
    const [loading, setLoading] = useState(false)
    const [chatInput, setChatInput] = useState("")
    const [imageUrl, setImageUrl] = useState(''); // Initial placeholder image
    const [model1, setModel1] = useState("gpt-4o")
    const [model2, setModel2] = useState("phi3:medium")
    const [response1, setResponse1] = useState("")
    const [response2, setResponse2] = useState("")


    const handleChatSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        if (chatInput.trim() !== "") {

            try {

                // Make two parallel async calls
                const [output1, output2] = await Promise.all([
                    generate(chatInput),
                    continueConversation(chatInput)
                ]);

                let updatedResponse1 = ""; // Temporary variable to hold new responses for model1
                let updatedResponse2 = ""; // Temporary variable to hold new responses for model2

                // Create promises for processing both streams
                const processOutput1 = (async () => {
                    for await (const delta of readStreamableValue(output1.output)) {
                        updatedResponse1 += delta; // Concatenate new response
                        setResponse1(updatedResponse1); // Update state with each new response
                    }
                })();

                const processOutput2 = (async () => {
                    for await (const delta of readStreamableValue(output2.ouput)) {
                        updatedResponse2 += delta; // Concatenate new response
                        setResponse2(updatedResponse2); // Update state with each new response
                    }
                })();

                // Use Promise.race to handle whichever completes first
                await Promise.race([processOutput1, processOutput2]);

                // Continue processing the remaining output
                await Promise.all([processOutput1, processOutput2]);
            }
            catch (error) {
                console.error('Error generating response:', error);
            }
            finally {
                setLoading(false)
                setChatInput("");
            }
        }
    };

    return (
        <div className="flex flex-col h-fit">
            <div className="flex-1 flex flex-col items-center bg-gradient-to-br from-primary to-secondary">
                <div className="max-w-2xl px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold text-primary-foreground mb-4">Model Comparison</h1>
                    <p className="text-lg text-secondary-foreground mb-8">
                        Enter your question and compare the output of various large langauge models.
                    </p>
                </div>
                <div className="w-full px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 flex justify-center gap-8">
                        <div className="w-full max-w-lg">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full dark:bg-gray-100 bg-gray-100">
                                        {model1}
                                        <ChevronDownIcon className="w-4 h-4 ml-auto" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-full">
                                    <DropdownMenuItem onSelect={() => setModel1("gpt-4o")}>gpt-4o</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <div className="grid grid-cols-1 gap-6 overflow-auto h-full max-h-96">
                                <ReactMarkdown>{response1}</ReactMarkdown>
                            </div>
                        </div>
                        <div className="w-full max-w-lg">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full w-full dark:bg-gray-100 bg-gray-100">
                                        {model2}
                                        <ChevronDownIcon className="w-4 h-4 ml-auto" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-full">
                                    <DropdownMenuItem onSelect={() => setModel2("phi3:medium")}>phi3:medium</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <div className="grid grid-cols-1 gap-6 overflow-auto h-full max-h-96">
                                <ReactMarkdown>{response2}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-2xl w-full px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <div className="relative">
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) { // Checks if Enter is pressed without the Shift key
                                    handleChatSubmit(e); // Assuming handleChatSubmit is adapted to be called like this
                                }
                            }}
                            type="text"
                            placeholder="Enter your question to compare models"
                            className="bg-card text-card-foreground rounded-full py-3 px-5 pr-16 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-md"
                        />
                        <button
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary-hover transition-colors"
                            onClick={(e) => {
                                handleChatSubmit(e);
                            }}
                        >
                            {loading ? (
                                <div className="w-6 h-6 animate-spin border-4 border-primary-foreground border-t-transparent rounded-full" />
                            ) : (
                                <SendIcon className="w-6 h-6" />
                            )}
                        </button>
                    </div>

                </div>
            </div>
            {/* <div className="bg-background text-foreground p-4 text-center">
                <p className="text-sm text-muted-foreground">Powered by Azure OpenAI Dall·E 3</p>
            </div> */}
        </div>
    )
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    )
}