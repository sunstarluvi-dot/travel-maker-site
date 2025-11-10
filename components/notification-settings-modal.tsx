"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface NotificationSettingsModalProps {
  open: boolean
  onClose: () => void
}

export default function NotificationSettingsModal({ open, onClose }: NotificationSettingsModalProps) {
  const [keywords, setKeywords] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState("")
  const [regionInput, setRegionInput] = useState("")

  useEffect(() => {
    if (open) {
      try {
        const savedKeywords = JSON.parse(localStorage.getItem("notif-keywords") || "[]")
        const savedRegions = JSON.parse(localStorage.getItem("notif-regions") || "[]")
        setKeywords(savedKeywords)
        setRegions(savedRegions)
      } catch {}
    }
  }, [open])

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      const updated = [...keywords, keywordInput.trim()]
      setKeywords(updated)
      localStorage.setItem("notif-keywords", JSON.stringify(updated))
      setKeywordInput("")
    }
  }

  const removeKeyword = (keyword: string) => {
    const updated = keywords.filter((k) => k !== keyword)
    setKeywords(updated)
    localStorage.setItem("notif-keywords", JSON.stringify(updated))
  }

  const addRegion = () => {
    if (regionInput.trim() && !regions.includes(regionInput.trim())) {
      const updated = [...regions, regionInput.trim()]
      setRegions(updated)
      localStorage.setItem("notif-regions", JSON.stringify(updated))
      setRegionInput("")
    }
  }

  const removeRegion = (region: string) => {
    const updated = regions.filter((r) => r !== region)
    setRegions(updated)
    localStorage.setItem("notif-regions", JSON.stringify(updated))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>알림 설정</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label htmlFor="keyword-input" className="mb-2 block">
              키워드 알림
            </Label>
            <div className="flex gap-2">
              <Input
                id="keyword-input"
                placeholder="예: 카페, 맛집, 골목"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
              />
              <Button onClick={addKeyword}>추가</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {keywords.map((keyword) => (
                <Badge key={keyword} className="gap-1">
                  {keyword}
                  <button onClick={() => removeKeyword(keyword)} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="region-input" className="mb-2 block">
              지역 알림
            </Label>
            <div className="flex gap-2">
              <Input
                id="region-input"
                placeholder="예: 순천, 강릉, 전주"
                value={regionInput}
                onChange={(e) => setRegionInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRegion())}
              />
              <Button onClick={addRegion}>추가</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {regions.map((region) => (
                <Badge key={region} className="gap-1">
                  {region}
                  <button onClick={() => removeRegion(region)} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            설정한 키워드나 지역과 관련된 새로운 코스가 등록되면 알림을 받습니다.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
