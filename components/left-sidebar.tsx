"use client"

import { useEffect, useState } from "react"
import AdBannerNew from "@/components/ad/ad-banner-new"
import { pickTwoDistinctAds } from "@/lib/ads"
import type { AdItem } from "@/lib/types"

export default function LeftSidebar() {
  const [leftAd, setLeftAd] = useState<AdItem | null>(null)

  useEffect(() => {
    const [a] = pickTwoDistinctAds()
    setLeftAd(a)
  }, [])

  return (
    <aside className="hidden xl:block w-[250px] shrink-0">
      <div className="sticky top-20 space-y-4">
        {/* Regional Banner */}
        <div className="rounded-2xl overflow-hidden soft-shadow bg-gradient-to-br from-[#3A9CFD]/10 to-[#FF6F42]/10 p-6">
          <h3 className="font-bold text-lg mb-2">지역별 추천</h3>
          <p className="text-sm text-muted-foreground mb-4">당신의 지역에서 시작하는 특별한 여행</p>
          <div className="space-y-2">
            {["경상도", "전라도", "충청도", "강원도"].map((region) => (
              <button
                key={region}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/50 transition-colors text-sm"
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {leftAd && <AdBannerNew ad={leftAd} />}
      </div>
    </aside>
  )
}
