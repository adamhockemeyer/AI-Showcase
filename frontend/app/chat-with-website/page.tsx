'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send } from "lucide-react"
import { generate_with_bing_search_tool } from "@/actions/openai"
import { readStreamableValue } from 'ai/rsc';
import ReactMarkdown from 'react-markdown';
//import remarkGfm from 'remark-gfm';

export default function Component() {
    const [url, setUrl] = useState('')
    const [iframeLoaded, setIframeLoaded] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [messages, setMessages] = useState<{ user: string; bot: string; }[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const chatContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (iframeRef.current) {
            iframeRef.current.onload = () => setIframeLoaded(true)
        }
    }, [url])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (url) {
            setIframeLoaded(false)
            setShowChat(false)
        }
    }


    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (inputMessage.trim()) {
            setMessages([...messages, { user: inputMessage, bot: '' }])
            // Here you would typically send the message to your AI service and get a response
            // For this example, we'll just echo the message back

            try {
                console.log('Generating response...');

                const { output } = await generate_with_bing_search_tool(inputMessage, url);

                const newEntryIndex = messages.length; // Get the index of the new entry

                let updatedChatResponses = ""; // Temporary variable to hold new responses
                for await (const delta of readStreamableValue(output)) {

                    console.log('Received response:', delta);
                    updatedChatResponses += delta; // Concatenate new response
                    //setChatResponses(updatedChatResponses); // Update state with each new response

                    // Update the specific chatHistory entry with the new response
                    setMessages(currentHistory =>
                        currentHistory.map((item, index) =>
                            index === newEntryIndex ? { ...item, bot: updatedChatResponses } : item
                        )
                    );
                }

            } catch (error) {
                console.error('Error generating response:', error);
            }
            finally {
                setInputMessage('')
            }
        }
    }

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [messages])

    return (
        <div className="flex flex-col h-screen">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 bg-gray-100">
                <Input
                    type="url"
                    placeholder="Enter website URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-grow dark:bg-white"
                />
                <Button type="submit">Load</Button>
            </form>
            <div className="relative flex-grow">
                {url && (
                    <iframe
                        ref={iframeRef}
                        src={url}
                        className="w-full h-full border-none"
                        title="Website Viewer"
                    />
                )}
                {iframeLoaded && (
                    <Button
                        className="absolute bottom-4 right-4 rounded-full w-12 h-12 p-0"
                        onClick={() => setShowChat(!showChat)}
                    >
                        <MessageCircle className="w-6 h-6" />
                    </Button>
                )}
                {showChat && (
                    <div className="absolute bottom-20 right-4 w-80 h-96 bg-white border rounded-lg shadow-lg flex flex-col">
                        <div className="p-4 border-b font-semibold">AI Chat</div>
                        <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
                            {messages.map((message, index) => (
                                <div key={index}>
                                    <div className={`flex justify-start`}>
                                        <div className={`max-w-[70%] p-2 rounded-lg bg-blue-500 text-white`}>
                                            <ReactMarkdown >{message.user}</ReactMarkdown>
                                        </div>
                                    </div>
                                    <div className={`flex justify-end `}>
                                        <div className={`max-w-[70%] p-2 rounded-lg bg-gray-200`}>
                                            <ReactMarkdown >{message.bot}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleChatSubmit} className="p-4 border-t flex gap-2">
                            <Input
                                type="text"
                                placeholder="Ask about the website..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                className="flex-grow dark:bg-white"
                            />
                            <Button type="submit" size="icon">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
