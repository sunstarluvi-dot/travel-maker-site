"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface TopCategoryTabsProps {
  onCategoryChange: (category: "travel" | "specialty" | "goods") => void
}

export default function TopCategoryTabs({ onCategoryChange }: TopCategoryTabsProps) {
  const [activeTab, setActiveTab] = useState<"travel" | "specialty" | "goods">("travel")

  const handleTabClick = (tab: "travel" | "specialty" | "goods") => {
    setActiveTab(tab)
    onCategoryChange(tab)
  }

  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
      <Button
        variant={activeTab === "travel" ? "default" : "outline"}
        onClick={() => handleTabClick("travel")}
        className={`whitespace-nowrap ${
          activeTab === "travel"
            ? "bg-gradient-to-r from-[#3A9CFD] to-[#FF6F42] text-white hover:opacity-90"
            : "hover:bg-muted"
        }`}
      >
        여행상품
      </Button>
      <Button
        variant={activeTab === "specialty" ? "default" : "outline"}
        onClick={() => handleTabClick("specialty")}
        className={`whitespace-nowrap ${
          activeTab === "specialty"
            ? "bg-gradient-to-r from-[#3A9CFD] to-[#FF6F42] text-white hover:opacity-90"
            : "hover:bg-muted"
        }`}
      >
        특산품
      </Button>
      <Button
        variant={activeTab === "goods" ? "default" : "outline"}
        onClick={() => handleTabClick("goods")}
        className={`whitespace-nowrap ${
          activeTab === "goods"
            ? "bg-gradient-to-r from-[#3A9CFD] to-[#FF6F42] text-white hover:opacity-90"
            : "hover:bg-muted"
        }`}
      >
        굿즈
      </Button>
    </div>
  )
}
