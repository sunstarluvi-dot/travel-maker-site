"use client"

import { Button } from "@/components/ui/button"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useToast } from "@/hooks/use-toast"

interface SubscribeButtonProps {
  creatorId?: string
  creatorName?: string
  variant?: "default" | "compact"
}

export default function SubscribeButton({ creatorId, creatorName, variant = "default" }: SubscribeButtonProps) {
  const [subscriptions, setSubscriptions] = useLocalStorage<Record<string, boolean>>("tm-creator-subs", {})
  const { toast } = useToast()

  if (!creatorId) return null

  const isSubscribed = !!subscriptions[creatorId]

  const handleToggle = () => {
    setSubscriptions((prev) => ({
      ...prev,
      [creatorId]: !isSubscribed,
    }))

    if (!isSubscribed) {
      toast({
        title: "구독 완료",
        description: `${creatorName || "크리에이터"}님을 구독했습니다! 새로운 코스 소식을 알려드릴게요.`,
      })
    } else {
      toast({
        title: "구독 해제",
        description: `${creatorName || "크리에이터"} 소식 알림을 중지했습니다.`,
      })
    }
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleToggle}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all ${
          isSubscribed
            ? "bg-gradient-to-r from-[#3A9CFD] to-[#FF6F42] text-white border-transparent"
            : "bg-white hover:bg-slate-50 border-slate-300"
        }`}
        aria-pressed={isSubscribed}
        aria-label={isSubscribed ? "구독 중" : "구독하기"}
      >
        {isSubscribed ? "구독 중" : "구독하기"}
        {creatorName && ` · ${creatorName}`}
      </button>
    )
  }

  return (
    <Button
      onClick={handleToggle}
      variant={isSubscribed ? "default" : "outline"}
      className={`rounded-full ${isSubscribed ? "bg-gradient-to-r from-[#3A9CFD] to-[#FF6F42] hover:opacity-90" : ""}`}
    >
      {isSubscribed ? "구독 중" : "구독하기"}
    </Button>
  )
}
