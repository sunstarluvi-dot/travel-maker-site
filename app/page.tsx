"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import LeftSidebar from "@/components/left-sidebar"
import RightSidebar from "@/components/right-sidebar"
import BannerSlider from "@/components/banner-slider"
import CategoryButtons from "@/components/category-buttons"
import TravelCard from "@/components/travel-card"
import Footer from "@/components/footer"
import { getAllCourses } from "@/lib/course"
import type { Course } from "@/lib/types"
import { filterByProvinceAndCity } from "@/lib/geo"
import type { Province } from "@/lib/constants"

function useKillLegacyChatbot() {
  useEffect(() => {
    const isGlobal = (el: Element) => (el as HTMLElement).getAttribute("data-origin") === "global"
    const candidates = Array.from(
      document.querySelectorAll('#chatbot-icon, .chatbot, [data-chatbot], [aria-label="도움이 필요하신가요?"]'),
    )
    candidates.filter((el) => !isGlobal(el)).forEach((el) => el.parentElement?.removeChild(el))
  }, [])
}

export default function HomePage() {
  useKillLegacyChatbot()

  const masterCoursesRef = useRef<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFilter, setSearchFilter] = useState("all")
  const [wishlistIds, setWishlistIds] = useState<number[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const searchParams = useSearchParams()
  const provinceFilter = searchParams.get("province") || ""
  const cityFilter = searchParams.get("city") || ""

  useEffect(() => {
    let mounted = true
    const loadCourses = async () => {
      try {
        const data = await getAllCourses()
        if (!mounted) return
        masterCoursesRef.current = Array.isArray(data) ? [...data] : []
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadCourses()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!loading && masterCoursesRef.current.length > 0 && selectedCategory === "all") {
      setRefreshTrigger((prev) => prev + 1)
    }
  }, [loading, selectedCategory])

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
        setWishlistIds(Array.isArray(wishlist) ? wishlist : [])
      } catch {
        setWishlistIds([])
      }
    }

    loadWishlist()

    window.addEventListener("wishlistChanged", loadWishlist)
    return () => window.removeEventListener("wishlistChanged", loadWishlist)
  }, [])

  const filteredCourses = useMemo(() => {
    const masterList = masterCoursesRef.current
    if (!masterList || masterList.length === 0) return []

    let result = masterList.filter((course) => {
      if (selectedCategory === "all") return true

      if (selectedCategory === "wishlist") {
        return wishlistIds.includes(course.id)
      }

      if (selectedCategory === "halal") return course.halalCertified === true
      if (selectedCategory === "official") return course.officialCertified === true
      if (selectedCategory === "pet") return course.petFriendly === true

      const courseCategory = (course.category || "").toLowerCase().trim()
      const selectedCat = selectedCategory.toLowerCase().trim()

      const categoryMap: Record<string, string> = {
        local: "로컬",
        cafe: "카페",
        food: "맛집",
        nature: "자연",
        culture: "문화",
        budget: "가성비",
      }

      const targetLabel = categoryMap[selectedCat] || selectedCat

      return courseCategory === targetLabel.toLowerCase() || courseCategory.includes(targetLabel.toLowerCase())
    })

    if (provinceFilter) {
      result = filterByProvinceAndCity(result, provinceFilter as Province, cityFilter || null)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((course) => {
        if (searchFilter === "location") {
          return course.region.toLowerCase().includes(query)
        }
        if (searchFilter === "category") {
          return course.category.toLowerCase().includes(query)
        }
        if (searchFilter === "keyword") {
          return course.description.toLowerCase().includes(query)
        }
        return (
          course.title.toLowerCase().includes(query) ||
          course.region.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query)
        )
      })
    }

    return result
  }, [selectedCategory, searchQuery, searchFilter, wishlistIds, refreshTrigger, provinceFilter, cityFilter])

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={(query, filter) => {
          setSearchQuery(query)
          setSearchFilter(filter)
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex gap-6">
          <LeftSidebar />

          <main className="flex-1 min-w-0">
            <div className="mb-8">
              <BannerSlider />
            </div>

            <div className="mb-8">
              <CategoryButtons onCategoryChange={setSelectedCategory} />
            </div>

            {loading ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">로딩 중...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <TravelCard key={course.id} {...course} />
                  ))}
                </div>

                {filteredCourses.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg">
                      {selectedCategory === "wishlist"
                        ? "찜한 여행 코스가 없습니다"
                        : provinceFilter
                          ? `${provinceFilter}${cityFilter && cityFilter !== "전체" ? ` ${cityFilter}` : ""}의 검색 결과가 없습니다`
                          : "검색 결과가 없습니다"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedCategory === "wishlist"
                        ? "마음에 드는 여행 코스를 찜해보세요"
                        : provinceFilter
                          ? "다른 지역을 선택하거나 필터를 조정하세요"
                          : "다른 키워드로 검색해보세요"}
                    </p>
                  </div>
                )}
              </>
            )}
          </main>

          <RightSidebar />
        </div>
      </div>

      <Footer />
    </div>
  )
}
