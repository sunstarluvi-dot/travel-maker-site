"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Hash, Sparkles, SlidersHorizontal, ArrowUpDown } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import TravelCard from "@/components/travel-card"
import FilterBar, { type FilterValues } from "@/components/filter-bar"
import TopCategoryTabs from "@/components/top-category-tabs"
import LeftSidebar from "@/components/left-sidebar"
import RightSidebar from "@/components/right-sidebar"
import MobileSidebarButton from "@/components/mobile-sidebar-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllCourses } from "@/lib/course"
import { filterByProvinceAndCity } from "@/lib/geo"
import type { Province } from "@/lib/constants"
import type { Course } from "@/lib/types"

const topCourses = [
  { id: 5, rank: 1, title: "전주 구도심 로컬 맛집 탐방 1일 코스", region: "전주", views: 15420 },
  { id: 2, rank: 2, title: "강릉 로컬 로스터리 카페 투어", region: "강릉", views: 13850 },
  { id: 1, rank: 3, title: "순천 골목 속 감성 산책 하루", region: "순천", views: 12390 },
  { id: 6, rank: 4, title: "통영 골목 시장과 감성 카페", region: "통영", views: 11560 },
  { id: 3, rank: 5, title: "경주 구도심 골목 맛집 탐방", region: "경주", views: 10720 },
]

const trendingHashtags = [
  { tag: "#골목투어", count: 2840, growth: "+28%" },
  { tag: "#로컬맛집", count: 2390, growth: "+35%" },
  { tag: "#로컬카페", count: 1950, growth: "+22%" },
  { tag: "#구도심", count: 1620, growth: "+18%" },
  { tag: "#전통시장", count: 1380, growth: "+15%" },
]

export default function ExplorePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null)
  const [topCategory, setTopCategory] = useState<"travel" | "specialty" | "goods">("travel")
  const [sortOrder, setSortOrder] = useState<"latest" | "popular">("popular")
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const provinceFilter = searchParams.get("province") || ""
  const cityFilter = searchParams.get("city") || ""

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true)
      const courses = await getAllCourses()
      setAllCourses(courses)
      setFilteredCourses(courses)
      setLoading(false)
    }
    loadCourses()
  }, [])

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters)

    const filtered = allCourses.filter((course) => {
      if (filters.province !== "전체" && filters.city !== "전체" && course.region !== filters.city) return false
      if (filters.province !== "전체" && filters.city === "전체") {
        // If only province is selected, show all cities in that province
        // This would require province data in courses, for now we'll skip this filter
      }

      if (filters.category !== "전체" && course.category !== filters.category) return false

      if (filters.duration !== "전체") {
        const durationMap: Record<string, number> = {
          "1일": 1,
          "2박 3일": 2,
          "3박 4일": 3,
          "4박 5일": 4,
        }
        if (course.days !== durationMap[filters.duration]) return false
      }

      if (
        course.price.total &&
        (course.price.total < filters.priceRange[0] || course.price.total > filters.priceRange[1])
      )
        return false

      if (filters.petFriendly && !course.petFriendly) return false

      if (filters.difficulty !== "전체") {
        const difficultyLevel = Number.parseInt(filters.difficulty.charAt(0))
        if (course.difficulty !== difficultyLevel) return false
      }

      return true
    })

    setFilteredCourses(filtered)
  }

  const handleResetFilters = () => {
    setActiveFilters(null)
    setFilteredCourses(allCourses)
  }

  const provinceFilteredCourses = provinceFilter
    ? filterByProvinceAndCity(filteredCourses, provinceFilter as Province, cityFilter || null)
    : filteredCourses

  const categoryFilteredCourses = provinceFilteredCourses.filter((course) => {
    const courseType = course.categoryType || "여행상품"
    if (topCategory === "travel") return courseType === "여행상품"
    if (topCategory === "specialty") return courseType === "특산품"
    if (topCategory === "goods") return courseType === "굿즈"
    return true
  })

  const sortedCourses = [...categoryFilteredCourses].sort((a, b) => {
    if (sortOrder === "latest") {
      return new Date(b.createdAt || "2024-01-01").getTime() - new Date(a.createdAt || "2024-01-01").getTime()
    } else {
      const aPopularity = a.likes + a.comments * 2
      const bPopularity = b.likes + b.comments * 2
      return bPopularity - aPopularity
    }
  })

  const hasActiveFilters = activeFilters !== null

  const getSectionTitle = () => {
    if (hasActiveFilters) {
      return `필터 결과 (${sortedCourses.length}개)`
    }

    const provincePrefix = provinceFilter ? `${provinceFilter} ` : ""

    if (topCategory === "specialty") {
      return sortOrder === "latest" ? `${provincePrefix}최신 특산품` : `${provincePrefix}인기 특산품`
    }

    if (topCategory === "goods") {
      return sortOrder === "latest" ? `${provincePrefix}최신 굿즈` : `${provincePrefix}인기 굿즈`
    }

    return sortOrder === "latest" ? `${provincePrefix}최신 로컬 코스` : `${provincePrefix}인기 로컬 코스`
  }

  const getPageTitle = () => {
    if (topCategory === "specialty") return "지금 인기 있는 지역 특산품"
    if (topCategory === "goods") return "TRAVEL MAKER 공식 굿즈"
    return "지금 인기 있는 로컬 여행 코스"
  }

  const getPageSubtitle = () => {
    if (topCategory === "specialty") return "전국 각지의 신선한 로컬 특산품을 만나보세요"
    if (topCategory === "goods") return "여행을 더 특별하게 만들어줄 감성 굿즈"
    return "현지인만 아는 숨은 명소를 발견하세요"
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex gap-6">
          <LeftSidebar />

          <main className="flex-1 min-w-0">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD]">
                {getPageTitle()}
              </h1>
              <p className="text-muted-foreground">{getPageSubtitle()}</p>
            </div>

            <TopCategoryTabs onCategoryChange={(cat) => setTopCategory(cat as "travel" | "specialty" | "goods")} />

            <div className="flex items-center justify-between mb-6 gap-4">
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "latest" | "popular")}>
                <SelectTrigger className="w-[160px]">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">인기순</SelectItem>
                  <SelectItem value="latest">최신순</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => setIsFilterOpen(true)}
                className="gap-2 bg-gradient-to-r from-[#3A9CFD] to-[#FF6F42] text-white"
              >
                <SlidersHorizontal className="w-4 h-4" />
                필터
                {activeFilters && <Badge className="ml-1 bg-white/20 text-white border-0">활성</Badge>}
              </Button>
            </div>

            <FilterBar
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />

            {!hasActiveFilters && topCategory === "travel" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                <div className="lg:col-span-2">
                  <Card className="soft-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Top 5 인기 코스
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topCourses.map((course) => (
                          <Link key={course.id} href={`/course/${course.id}`}>
                            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-[#3A9CFD]/5 hover:to-[#FF6F42]/5 transition-all cursor-pointer group">
                              <div
                                className={`
                          flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg shrink-0
                          ${course.rank === 1 ? "bg-gradient-to-br from-[#FF6F42] to-[#FF6F42]/70 text-white" : ""}
                          ${course.rank === 2 ? "bg-gradient-to-br from-[#bba9fe] to-[#bba9fe]/70 text-white" : ""}
                          ${course.rank === 3 ? "bg-gradient-to-br from-[#3A9CFD] to-[#3A9CFD]/70 text-white" : ""}
                          ${course.rank > 3 ? "bg-muted text-muted-foreground" : ""}
                        `}
                              >
                                {course.rank}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                                  {course.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">{course.region}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-sm font-medium">{course.views.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">조회수</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="soft-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Hash className="w-5 h-5 text-secondary" />
                        트렌딩 해시태그
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {trendingHashtags.map((item) => (
                          <div
                            key={item.tag}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-[#3A9CFD]/5 hover:to-[#FF6F42]/5 transition-all cursor-pointer"
                          >
                            <div>
                              <p className="font-semibold text-primary">{item.tag}</p>
                              <p className="text-xs text-muted-foreground">{item.count.toLocaleString()} 게시물</p>
                            </div>
                            <Badge className="bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD] text-white border-0">
                              {item.growth}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-secondary" />
                <h2 className="text-2xl font-bold">{getSectionTitle()}</h2>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedCourses.map((course) => (
                      <TravelCard key={course.id} {...course} />
                    ))}
                  </div>
                  {sortedCourses.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg mb-2">
                        {topCategory === "specialty" &&
                          (provinceFilter
                            ? `${provinceFilter}의 특산품이 아직 없습니다.`
                            : "해당 카테고리의 특산품이 아직 없습니다.")}
                        {topCategory === "goods" &&
                          (provinceFilter
                            ? `${provinceFilter}의 굿즈가 아직 없습니다.`
                            : "해당 카테고리의 굿즈가 아직 없습니다.")}
                        {topCategory === "travel" && hasActiveFilters
                          ? "필터 조건에 맞는 여행 코스가 없습니다."
                          : provinceFilter
                            ? `${provinceFilter}의 코스가 없습니다.`
                            : "해당 카테고리에 코스가 없습니다."}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {provinceFilter
                          ? "다른 지역을 선택하거나 필터를 조정하세요"
                          : "곧 다양한 상품들이 추가될 예정입니다"}
                      </p>
                      {hasActiveFilters && (
                        <Button onClick={handleResetFilters} className="mt-4">
                          필터 초기화
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </main>

          <RightSidebar />
        </div>

        <MobileSidebarButton />
      </div>

      <Footer />
    </div>
  )
}
