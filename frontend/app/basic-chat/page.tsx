"use client"

import React, { useEffect, useRef } from 'react';
import { SVGProps, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { generate } from "@/actions/openai"
import { readStreamableValue } from 'ai/rsc';

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export default function Component() {
  const [activeTab, setActiveTab] = useState("demo")
  const [chatInput, setChatInput] = useState("")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState<{ user: string; bot: string; }[]>([]) // Define the type of chatHistory
  const [chatResponses, setChatResponses] = useState<string>("") // Declare the setChatResponses function
  const [creativeSlider, setCreativeSlider] = useState(50)
  const [tokenLimit, setTokenLimit] = useState(1000)

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]); // Assuming chatHistory is your state variable holding the chat messages


  const handleChatSubmit = async (e: any) => {
    e.preventDefault();
    if (chatInput.trim() !== "") {
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

      setChatInput("");
    }
  };
  const handleCreativeSliderChange = (value: any) => {
    //setCreativeSlider(value)
  }
  const handleTokenLimitChange = (e: any) => {
    //setTokenLimit(e.target.value)
  }


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4"> Basic Chat</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="flex border-b text-lg">
              <TabsTrigger value="demo">Demo</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
            </TabsList>
            <TabsContent value="demo">
              <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-3xl h-96">
                  <div className="grid grid-cols-1 gap-6 overflow-auto h-full max-h-96">
                    {chatHistory.map((chat, index) => (
                      <div key={index} className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6">
                        <div className="flex items-start gap-4 justify-start p-6">
                          <Avatar className="border w-10 h-10">
                            {/* <AvatarImage src="/placeholder-user.jpg" /> */}
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="font-medium text-sm text-gray-500 leading-none dark:text-gray-400">
                              You &middot; 2:39pm
                            </p>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-sm">{chat.user}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 justify-end p-6">
                          <Avatar className="border w-10 h-10">
                            {/* <AvatarImage src="/placeholder-user.jpg" /> */}
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="font-medium text-sm text-gray-500 leading-none dark:text-gray-400">
                              AI &middot; 2:40pm
                            </p>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-sm">
                              {chat.bot}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>


                  <div className="fixed bottom-0 w-full max-w-3xl p-6 bg-white dark:bg-gray-950 shadow-md">
                    <form onSubmit={handleChatSubmit} className="flex items-center relative">
                      <Textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) { // Checks if Enter is pressed without the Shift key
                            e.preventDefault(); // Prevents the default action (new line or form submission)
                            // Call the submit function or any custom action here
                            // For example, if you have a function to handle the chat submission:
                            handleChatSubmit(e); // Assuming handleChatSubmit is adapted to be called like this
                          }
                        }}
                        placeholder="Enter your question..."
                        className="flex-1 rounded-l-lg border-r-0 focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 pr-12"
                      />
                      <Button type="submit" className="rounded-r-lg absolute right-3 bottom-3" variant="ghost" size="icon">
                        <SendIcon className="w-5 h-5" />
                        <span className="sr-only">Send</span>
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="description">
              <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Acme AI is a powerful conversational AI assistant that can help you with a variety of tasks, from text
                  generation to image creation and beyond. With its advanced natural language processing capabilities,
                  Acme AI can understand your queries and provide accurate and helpful responses.
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Whether you need to generate creative content, translate text, or summarize long documents, Acme AI
                  has you covered. Its intuitive interface and customizable settings allow you to tailor the AI's
                  behavior to your specific needs.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Acme AI is built on a robust and scalable architecture, ensuring reliable and efficient performance
                  even as your usage grows. With its commitment to security and privacy, you can trust Acme AI to handle
                  your sensitive information with the utmost care.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="architecture">
              <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Architecture</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Acme AI is built on a modular and scalable architecture that allows for easy expansion and
                  customization. The core of the system is a powerful language model that has been trained on a vast
                  amount of data, enabling it to understand and generate human-like text.
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This language model is integrated with a range of specialized modules, such as image generation, code
                  generation, and translation, each of which leverages its own set of algorithms and data sources to
                  provide the desired functionality.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  The system is designed to be highly scalable, with the ability to handle increasing volumes of user
                  requests and data processing requirements. It also incorporates robust security measures to protect
                  user privacy and ensure the integrity of the system.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <div
        className={`fixed bottom-4 right-4 bg-gray-100 dark:bg-gray-950 flex flex-col gap-2 text-gray-900 dark:text-white p-4 w-80 rounded-lg shadow-md transition-all duration-300 ${isSettingsOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
      >
        <Collapsible className="space-y-4">
          <div className="flex items-center justify-between space-x-4 px-4">
            <h4 className="text-sm font-semibold">Session Settings</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                T<span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border border-gray-200 px-4 py-2 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <span>Creativity vs Precision</span>
              <Slider
                value={[creativeSlider]}
                onValueChange={handleCreativeSliderChange}
                max={100}
                step={1}
                className="w-40"
              />
            </div>
          </div>
          <div className="rounded-md border border-gray-200 px-4 py-2 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <label htmlFor="token-limit">Token Limit</label>
              <Input
                id="token-limit"
                type="number"
                value={tokenLimit}
                onChange={handleTokenLimitChange}
                className="w-24"
              />
            </div>
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border border-gray-200 px-4 py-2 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span>Option 3</span>
                <Switch />
              </div>
            </div>
            <div className="rounded-md border border-gray-200 px-4 py-2 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span>Option 4</span>
                <Switch />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <div
        className={`fixed bottom-4 right-4 bg-gray-100 dark:bg-gray-950 cursor-pointer w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isSettingsOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
      >
        <SettingsIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        <span className="sr-only">Toggle settings</span>
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