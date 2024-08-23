"use client"

import React, { useEffect, useRef } from 'react';
import { SVGProps, useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { generate } from "@/actions/openai"
import { readStreamableValue } from 'ai/rsc';
import ReactMarkdown from 'react-markdown';

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export default function Component() {
  const [loading, setLoading] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatHistory, setChatHistory] = useState<{ user: string; bot: string; }[]>([]) // Define the type of chatHistory
  const [chatResponses, setChatResponses] = useState<string>("") // Declare the setChatResponses function


  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]); // Assuming chatHistory is your state variable holding the chat messages


  const handleChatSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (chatInput.trim() !== "") {

      try {

        const { output } = await generate(chatInput);

        // Add initial chat history entry
        setChatHistory(currentHistory => [
          ...currentHistory,
          { user: chatInput, bot: "" }, // Initial bot response could be empty or a placeholder
        ]);
        const newEntryIndex = chatHistory.length; // Get the index of the new entry

        let updatedChatResponses = ""; // Temporary variable to hold new responses
        for await (const delta of readStreamableValue(output)) {

          updatedChatResponses += delta; // Concatenate new response
          setChatResponses(updatedChatResponses); // Update state with each new response

          // Update the specific chatHistory entry with the new response
          setChatHistory(currentHistory =>
            currentHistory.map((item, index) =>
              index === newEntryIndex ? { ...item, bot: updatedChatResponses } : item
            )
          );
        }
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

    <div className="flex flex-col ">
      <div className="flex-1 flex flex-col items-center bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-2xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Basic Chat</h1>
          <p className="text-lg text-secondary-foreground mb-8">
            Enter your question and let our AI generate the perfect response.
          </p>

          <div className="mt-4">
            <div className="grid grid-cols-1 gap-6 overflow-auto h-full py-12">
              {chatHistory.map((chat, index) => (
                <div key={index} className="bg-white dark:bg-gray-150 rounded-lg shadow-md p-6">
                  <div className="flex items-start gap-4 justify-start p-6">
                    <Avatar className="border w-10 h-10">
                      {/* <AvatarImage src="/placeholder-user.jpg" /> */}
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="bg-gray-100 dark:bg-gray-300 rounded-lg px-4 py-2 text-sm">
                        <ReactMarkdown>{chat.user}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 justify-end p-6">
                    <Avatar className="border w-10 h-10">
                      {/* <AvatarImage src="/placeholder-user.jpg" /> */}
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="bg-gray-100 dark:bg-gray-300 rounded-lg px-4 py-2 text-sm">
                        <ReactMarkdown>{chat.bot}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
          <div ref={chatEndRef} />
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
              placeholder="Enter your question"
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
      <div className="bg-background text-foreground p-4 text-center">
        <p className="text-sm text-muted-foreground">Powered by Azure OpenAI GPT-4o</p>
      </div>
    </div>
  )


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


  function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
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
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
}