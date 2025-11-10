"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import AdBanner from "@/components/ad-banner"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function MobileSidebarButton() {
  const [open, setOpen] = useState(false)

  return (
    <div className="xl:hidden fixed bottom-4 right-4 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="lg" className="rounded-full shadow-lg bg-gradient-to-r from-[#3A9CFD] to-[#FF6F42]">
            <Menu className="w-5 h-5 mr-2" />
            추천/광고
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[70vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>추천 및 정보</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 mt-6">
            {/* Regional Recommendations */}
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

            {/* Creator Profile */}
            <div className="rounded-2xl overflow-hidden soft-shadow bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3A9CFD] to-[#FF6F42]" />
                <div>
                  <h3 className="font-bold text-sm">여행 크리에이터</h3>
                  <p className="text-xs text-muted-foreground">로컬 여행 전문가</p>
                </div>
              </div>
              <Link href="/upload" onClick={() => setOpen(false)}>
                <Button className="w-full rounded-full bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD] hover:opacity-90 transition-opacity">
                  <Plus className="w-4 h-4 mr-2" />새 코스 만들기
                </Button>
              </Link>
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

            {/* Ad Banner */}
            <AdBanner
              title="배화여대 캡스톤 프로젝트"
              description="지역 여행 코스 공유 플랫폼"
              image="/bustling-university-campus.png"
              link="https://www.baewha.ac.kr"
              closeable={false}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
