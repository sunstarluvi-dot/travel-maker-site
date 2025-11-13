"use client"

import { useState, useEffect } from "react"
import { UserCircle, MessageSquare, MessageCircle, Star, Wallet } from "lucide-react"

import AdBannerNew from "@/components/ad/ad-banner-new"
import { pickTwoDistinctAds } from "@/lib/ads"
import type { AdItem } from "@/lib/types"

export default function RightSidebar() {
  const [ads, setAds] = useState<AdItem[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const picked = pickTwoDistinctAds()
    setAds(picked)
  }, [])

  // 🔥 5초마다 광고 자동 변경
  useEffect(() => {
    if (ads.length === 0) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [ads])

  // 👉 왼쪽과 겹치지 않도록, 가능하면 한 칸 옆 광고를 보여줌
  const displayIndex = ads.length > 1 ? (index + 1) % ads.length : 0

  return (
    <aside className="hidden xl:block w-[300px] shrink-0">
      <div className="sticky top-20 space-y-6">

        {/* USER INFO */}
        <div className="rounded-2xl overflow-hidden soft-shadow bg-gradient-to-br from-[#3A9CFD]/20 to-[#FF6F42]/20 p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            {/* 왼쪽 : 프로필 */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3A9CFD] to-[#FF6F42] flex items-center justify-center">
                <UserCircle className="w-8 h-8 text-white" />
              </div>

              <div className="flex flex-col">
                <h3 className="font-bold text-lg">배둥이01</h3>
                <span className="text-xs px-2 py-0.5 bg-white/80 rounded-full text-muted-foreground w-fit mt-1">
                  충청남도
                </span>
              </div>
            </div>

            {/* 오른쪽 : LV 배너 */}
            <div className="flex flex-col items-center justify-center px-3 py-2 rounded-2xl bg-white/90 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-[#FF6F42] mb-1"
                fill="#FF6F42"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                  2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 
                  2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 
                  22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 
                  11.54L12 21.35z" />
              </svg>
              <span className="text-xs font-semibold text-muted-foreground">LV.3</span>
            </div>
          </div>

          {/* MY 활동 */}
          <div className="mt-4">
            <h4 className="font-semibold mb-3">MY 활동</h4>

            <div className="grid grid-cols-4 text-center gap-2">
              <div>
                <MessageSquare className="mx-auto w-6 h-6 text-[#3A9CFD]" />
                <p className="text-sm font-semibold mt-1">게시물</p>
                <p className="text-xs text-muted-foreground">0</p>
              </div>

              <div>
                <MessageCircle className="mx-auto w-6 h-6 text-[#3A9CFD]" />
                <p className="text-sm font-semibold mt-1">댓글</p>
                <p className="text-xs text-muted-foreground">0</p>
              </div>

              <div>
                <Star className="mx-auto w-6 h-6 text-[#3A9CFD]" />
                <p className="text-sm font-semibold mt-1">후기</p>
                <p className="text-xs text-muted-foreground">0</p>
              </div>

              <div>
                <Wallet className="mx-auto w-6 h-6 text-[#3A9CFD]" />
                <p className="text-sm font-semibold mt-1">마일리지</p>
                <p className="text-xs text-muted-foreground">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* 이번 주 인기 */}
        <div className="rounded-2xl overflow-hidden soft-shadow bg-white p-6">
          <h4 className="font-semibold mb-4">이번 주 인기</h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">등록된 코스</span>
              <span className="text-primary font-semibold">1,234</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">활동 크리에이터</span>
              <span className="text-[#FF6F42] font-semibold">567</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">이번 주 조회수</span>
              <span className="font-semibold text-muted-foreground">89K</span>
            </div>
          </div>
        </div>

        {/* 광고 자동 슬라이드 + 인디케이터 */}
        {ads.length > 0 && (
          <div className="space-y-2">
            <AdBannerNew ad={ads[displayIndex]} />

            <div className="flex justify-center gap-1 mt-1">
              {ads.map((ad, i) => (
                <button
                  key={ad?.id ?? i}
                  onClick={() => setIndex(i)}
                  aria-label={`오른쪽 광고 ${i + 1}`}
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
