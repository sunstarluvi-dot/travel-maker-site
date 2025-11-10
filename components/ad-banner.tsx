"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdBannerProps {
  title: string
  description: string
  image: string
  link?: string
  closeable?: boolean
}

export default function AdBanner({ title, description, image, link, closeable = true }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const BannerContent = (
    <div className="relative rounded-2xl overflow-hidden soft-shadow bg-gradient-to-r from-[#3A9CFD]/10 to-[#FF6F42]/10 border border-border">
      <div className="flex items-center gap-4 p-6">
        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 soft-shadow">
          <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg mb-1 text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        {closeable && (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full"
            onClick={(e) => {
              e.preventDefault()
              setIsVisible(false)
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity">
        {BannerContent}
      </a>
    )
  }

  return BannerContent
}
