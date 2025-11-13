"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Menu, MapPin, Tag, FileText, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import NotificationSettingsModal from "@/components/notification-settings-modal"
import { getAllCourses } from "@/lib/course"
import type { Course } from "@/lib/types"

interface HeaderProps {
  onSearch?: (query: string, filter: string) => void
}

function DiceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="#fff" />
      <circle cx="15.5" cy="8.5" r="1.5" fill="#fff" />
      <circle cx="8.5" cy="15.5" r="1.5" fill="#fff" />
      <circle cx="15.5" cy="15.5" r="1.5" fill="#fff" />
    </svg>
  )
}

export default function Header({ onSearch }: HeaderProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFilter, setSearchFilter] = useState("all")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [notificationModalOpen, setNotificationModalOpen] = useState(false)

  useEffect(() => {
    const loadCourses = async () => {
      const courses = await getAllCourses()
      setAllCourses(courses)
    }
    loadCourses()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery, searchFilter)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const travelCourses = allCourses.filter((course) => course.categoryType === "여행상품")
  const hasAnyTravelCourses = travelCourses.length > 0

  const handleRandomCourse = () => {
    if (!hasAnyTravelCourses) return
    const randomCourse = travelCourses[Math.floor(Math.random() * travelCourses.length)]
    router.push(`/course/${randomCourse.id}`)
}

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border soft-shadow">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="TRAVEL MAKER">

            {/* 이미지 로고 */}
            <img
              src="/brand/title.jpg"
              alt="TRAVEL MAKER"
              className="h-12 w-auto"
              loading="eager"
              decoding="async"
            />

            {/* 텍스트 로고 (복구) */}
            <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD]">
              TRAVEL MAKER
            </span>

         </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="shrink-0 rounded-full border-2 border-muted hover:border-primary transition-colors bg-transparent"
                  >
                    {searchFilter === "all" && "전체"}
                    {searchFilter === "location" && <MapPin className="w-4 h-4" />}
                    {searchFilter === "category" && <Tag className="w-4 h-4" />}
                    {searchFilter === "keyword" && <FileText className="w-4 h-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setSearchFilter("all")}>전체 검색</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchFilter("location")}>
                    <MapPin className="w-4 h-4 mr-2" />
                    여행지
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchFilter("category")}>
                    <Tag className="w-4 h-4 mr-2" />
                    카테고리
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchFilter("keyword")}>
                    <FileText className="w-4 h-4 mr-2" />
                    키워드
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleRandomCourse}
                      disabled={!hasAnyTravelCourses}
                      aria-label="랜덤 상품 보기"
                      title="랜덤 상품 보기"
                      className="shrink-0 h-11 w-11 rounded-full border-2 border-muted hover:border-[#FF6F42] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 bg-white text-gray-700 hover:text-[#FF6F42] focus:outline-none focus:ring-2 focus:ring-[#3A9CFD]/30"
                    >
                      <DiceIcon className="w-5 h-5 mx-auto transition-transform group-hover:rotate-12 group-active:rotate-45" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{hasAnyTravelCourses ? "랜덤 상품 보기" : "상품이 없습니다"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="여행지, 지역, 키워드로 검색하세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-11 rounded-full border-2 border-muted focus:border-primary transition-colors"
                />
              </div>
            </div>
          </form>

          {/* Category Menu */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              홈
            </Link>
            <Link href="/explore" className="text-sm font-medium hover:text-primary transition-colors">
              탐색
            </Link>
            <Link href="/upload" className="text-sm font-medium hover:text-primary transition-colors">
              코스 등록
            </Link>
            <button
              onClick={() => setNotificationModalOpen(true)}
              className="text-sm font-medium hover:text-primary transition-colors"
              aria-label="알림 설정"
            >
              <Bell className="w-5 h-5" />
            </button>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-muted active:bg-muted/80 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="메뉴 열기"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-full left-0 right-0 bg-white border-b border-border soft-shadow-lg z-50 lg:hidden animate-in slide-in-from-top slide-distance-sm duration-200">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="space-y-2">
                <div className="relative flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={handleRandomCourse}
                          disabled={!hasAnyTravelCourses}
                          aria-label="랜덤 상품 보기"
                          title="랜덤 상품 보기"
                          className="shrink-0 h-11 w-11 rounded-full border-2 border-muted bg-white text-gray-700 hover:border-[#FF6F42] hover:text-[#FF6F42] transition-all duration-200 hover:scale-110 active:scale-90 animate-pulse
                          "
                        >
                          <DiceIcon className="w-5 h-5 mx-auto" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{hasAnyTravelCourses ? "랜덤 상품 보기" : "상품이 없습니다"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="여행지, 지역, 키워드로 검색하세요"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 h-11 rounded-full border-2 border-muted"
                    />
                  </div>
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-2 pt-2 border-t">
                <Link
                  href="/"
                  className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  홈
                </Link>
                <Link
                  href="/explore"
                  className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  탐색
                </Link>
                <Link
                  href="/upload"
                  className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  코스 등록
                </Link>
              </nav>
            </div>
          </div>
        </>
      )}

      <NotificationSettingsModal open={notificationModalOpen} onClose={() => setNotificationModalOpen(false)} />
    </header>
  )
}
