import Link from "next/link"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-900 text-white px-4 md:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Acme AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Demos
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </header>
      <div className="flex-1 flex">
        <div className="bg-gray-100 dark:bg-gray-950 hidden md:flex flex-col gap-2 text-gray-900 dark:text-white p-4">
          <nav className="flex flex-col gap-1">
            <Link
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              href="#"
            >
              <SparkleIcon className="w-5 h-5" />
              <span>Text Generation</span>
            </Link>
            <Link
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              href="#"
            >
              <ImageIcon className="w-5 h-5" />
              <span>Image Generation</span>
            </Link>
            <Link
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              href="#"
            >
              <CodeIcon className="w-5 h-5" />
              <span>Code Generation</span>
            </Link>
            <Link
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              href="#"
            >
              <LanguagesIcon className="w-5 h-5" />
              <span>Translation</span>
            </Link>
            <Link
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              href="#"
            >
              <ViewIcon className="w-5 h-5" />
              <span>Summarization</span>
            </Link>
          </nav>
        </div>
        <main className="flex-1 p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Text Generation</CardTitle>
                <SparkleIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <p>Generate human-like text on any topic. Ideal for content creation, story writing, and more.</p>
                <div className="mt-4">
                  <Button>Try Demo</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Image Generation</CardTitle>
                <ImageIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <p>Create unique, high-quality images from text descriptions. Unleash your creativity.</p>
                <div className="mt-4">
                  <Button>Try Demo</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Code Generation</CardTitle>
                <CodeIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <p>
                  Generate production-ready code in multiple programming languages based on natural language
                  descriptions.
                </p>
                <div className="mt-4">
                  <Button>Try Demo</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Translation</CardTitle>
                <LanguagesIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <p>Translate text between multiple languages with high accuracy and natural-sounding output.</p>
                <div className="mt-4">
                  <Button>Try Demo</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Summarization</CardTitle>
                <ViewIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <p>Quickly summarize long articles, documents, or conversations into concise, key points.</p>
                <div className="mt-4">
                  <Button>Try Demo</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Anomaly Detection</CardTitle>
                <BadgeAlertIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <p>Identify unusual patterns or outliers in your data to uncover potential issues or opportunities.</p>
                <div className="mt-4">
                  <Button>Try Demo</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

function BadgeAlertIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}


function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}


function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}


function LanguagesIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  )
}


function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}


function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  )
}


function ViewIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" />
      <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
      <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
    </svg>
  )
}
