"use client"
import { UserCircle } from "lucide-react"
import { useEffect, useState } from "react"
import AdBannerNew from "@/components/ad/ad-banner-new"
import { pickTwoDistinctAds } from "@/lib/ads"
import type { AdItem } from "@/lib/types"

export default function RightSidebar() {
  const [rightAd, setRightAd] = useState<AdItem | null>(null)

  useEffect(() => {
    const [, b] = pickTwoDistinctAds()
    setRightAd(b)
  }, [])

  return (
    <aside className="hidden xl:block w-[280px] shrink-0">
      <div className="sticky top-20 space-y-4 pb-24">
        {/* User Info Card */}
        <div className="rounded-2xl overflow-hidden soft-shadow bg-gradient-to-br from-[#3A9CFD]/10 to-[#FF6F42]/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3A9CFD] to-[#FF6F42] flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">배둥이01</h3>
              <p className="text-sm text-muted-foreground">LV.3</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center p-2 rounded-lg bg-white/50">
              <div className="font-bold text-primary">12</div>
              <div className="text-muted-foreground text-xs">게시물</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/50">
              <div className="font-bold text-primary">28</div>
              <div className="text-muted-foreground text-xs">후기</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/50">
              <div className="font-bold text-primary">45</div>
              <div className="text-muted-foreground text-xs">찜</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/50">
              <div className="font-bold text-primary">67</div>
              <div className="text-muted-foreground text-xs">댓글</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-2xl overflow-hidden soft-shadow bg-white p-6">
          <h3 className="font-bold text-sm mb-4">이번 주 인기</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">등록된 코스</span>
              <span className="font-bold text-primary">1,234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">활동 크리에이터</span>
              <span className="font-bold text-secondary">567</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">이번 주 조회수</span>
              <span className="font-bold text-[#C9C9C9]">89K</span>
            </div>
          </div>
        </div>

        {rightAd && <AdBannerNew ad={rightAd} />}
      </div>
    </aside>
  )
}
