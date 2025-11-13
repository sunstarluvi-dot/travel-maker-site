"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import AdBannerNew from "@/components/ad/ad-banner-new"
import { pickTwoDistinctAds } from "@/lib/ads"
import type { AdItem } from "@/lib/types"
import { PROVINCES } from "@/lib/constants"

export default function LeftSidebar() {
  const [ads, setAds] = useState<AdItem[]>([])
  const [index, setIndex] = useState(0)

  const sp = useSearchParams()
  const activeProvince = sp.get("province")

  useEffect(() => {
    const picked = pickTwoDistinctAds()
    setAds(picked)
  }, [])

  // 🔥 자동 슬라이드 (5초마다)
  useEffect(() => {
    if (ads.length === 0) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [ads])

  return (
    <aside className="hidden xl:block w-[250px] shrink-0">
      <div className="sticky top-20 space-y-4">

        {/* 지역별 추천 패널 */}
        <div className="rounded-2xl overflow-hidden soft-shadow bg-gradient-to-br from-[#3A9CFD]/10 to-[#FF6F42]/10 p-6">
          <h3 className="font-bold text-lg mb-2">지역별 추천</h3>
          <p className="text-sm text-muted-foreground mb-4">
            당신의 지역에서 시작하는 특별한 여행
          </p>

          <div className="space-y-2">
            {PROVINCES.map((province) => (
              <Link
                key={province}
                href={`/?province=${encodeURIComponent(province)}`}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                  activeProvince === province
                    ? "bg-white font-semibold text-slate-900 shadow-sm"
                    : "hover:bg-white/50"
                }`}
              >
                <span>{province}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 광고 자동 슬라이드 + 인디케이터 */}
        {ads.length > 0 && (
          <div className="space-y-2">
            <AdBannerNew ad={ads[index]} />

            {/* dot 인디케이터 */}
            <div className="flex justify-center gap-1 mt-1">
              {ads.map((ad, i) => (
                <button
                  key={ad?.id ?? i}
                  onClick={() => setIndex(i)}
                  aria-label={`왼쪽 광고 ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-4 bg-primary" : "w-1.5 bg-slate-300/70"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
