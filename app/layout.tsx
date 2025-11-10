import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import ChatbotPanel from "@/components/ChatbotPanel"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "TRAVEL MAKER - 당신도 여행사가 될 수 있다",
  description: "여행 코스를 공유하고 발견하는 플랫폼",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <ChatbotPanel />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
