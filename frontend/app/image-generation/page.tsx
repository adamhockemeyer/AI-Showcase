"use client"

import { generateImage } from "@/actions/openai"
import { useState } from "react"
import Image from 'next/image'

export default function Component() {
    const [loading, setLoading] = useState(false)
    const [chatInput, setChatInput] = useState("")
    const [imageUrl, setImageUrl] = useState(''); // Initial placeholder image


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        if (chatInput.trim() !== "") {
            try {
                // Replace this with your actual image generation logic
                const generatedImageUrl = await generateImage(chatInput);
                if (generatedImageUrl.length !== 0) {
                    console.log(generatedImageUrl);
                    setImageUrl(generatedImageUrl[0].url ?? '/placeholder.svg');
                }

            } catch (error) {
                console.error('Error generating image:', error);
            } finally {
                setLoading(false);
            }
        }
    }


    return (
        <div className="flex flex-col h-fit">
            <div className="flex-1 flex flex-col items-center bg-gradient-to-br from-primary to-secondary">
                <div className="max-w-2xl px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold text-primary-foreground mb-4">AI Image Generator</h1>
                    <p className="text-lg text-secondary-foreground mb-8">
                        Enter your image search query and let our AI generate the perfect image to bring your vision to life.
                    </p>
                    <div className="relative">
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) { // Checks if Enter is pressed without the Shift key
                                    handleSubmit(e); // Assuming handleChatSubmit is adapted to be called like this
                                }
                            }}
                            type="text"
                            placeholder="Enter your image search question"
                            className="bg-card text-card-foreground rounded-full py-3 px-5 pr-16 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-md"
                        />
                        <button
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary-hover transition-colors"
                            onClick={(e) => {
                                handleSubmit(e);
                            }}
                        >
                            {loading ? (
                                <div className="w-6 h-6 animate-spin border-4 border-primary-foreground border-t-transparent rounded-full" />
                            ) : (
                                <SearchIcon className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                    <div className="mt-4">
                        {loading && <p className="text-sm text-secondary-foreground">Generating image...</p>}
                        {imageUrl === '' ? (<span></span>) :
                            (<img
                                src={imageUrl}
                                width={600}
                                height={600}
                                alt="Bring your vision to life with our AI Image Generator"
                                className="rounded-lg"
                                style={{ aspectRatio: "600/600", objectFit: "cover" }}
                            />)}
                    </div>
                </div>
            </div>
            <div className="bg-background text-foreground p-4 text-center">
                <p className="text-sm text-muted-foreground">Powered by Azure OpenAI Dall·E 3</p>
            </div>
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