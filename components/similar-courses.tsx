"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Heart } from "lucide-react"
import type { Course } from "@/lib/types"
import { getSimilarCourses } from "@/lib/ai-recommendations"
import { getAllCourses } from "@/lib/course"

interface SimilarCoursesProps {
  currentCourse: Course
  limit?: number
}

export default function SimilarCourses({ currentCourse, limit = 3 }: SimilarCoursesProps) {
  const [similar, setSimilar] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  const recommendationTitle = useMemo(() => {
    const categoryType = currentCourse?.categoryType
    if (categoryType === "특산품") return "유사 특산품 추천"
    if (categoryType === "굿즈") return "유사 굿즈 추천"
    return "유사코스 추천"
  }, [currentCourse])

  useEffect(() => {
    const loadSimilar = async () => {
      try {
        const all = await getAllCourses()
        const recommendations = getSimilarCourses(currentCourse, all, limit)
        setSimilar(recommendations)
      } catch (error) {
        console.error("Failed to load similar courses:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSimilar()
  }, [currentCourse, limit])

  if (loading) {
    return (
      <Card className="soft-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (similar.length === 0) {
    return (
      <Card className="soft-shadow">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD]">
            {recommendationTitle}
          </h2>
          <div className="text-center py-8 text-muted-foreground">
            <p>
              {currentCourse.categoryType === "특산품"
                ? "현재 비슷한 특산품이 없습니다."
                : currentCourse.categoryType === "굿즈"
                  ? "현재 비슷한 굿즈가 없습니다."
                  : "현재 비슷한 코스가 없습니다."}
            </p>
            <p className="text-sm mt-2">
              {currentCourse.categoryType === "특산품" || currentCourse.categoryType === "굿즈"
                ? "더 많은 상품이 추가될 예정이에요!"
                : "더 많은 코스가 추가될 예정이에요!"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="soft-shadow">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD]">
          {recommendationTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {similar.map((course) => (
            <Link key={course.id} href={`/course/${course.id}`}>
              <div className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {course.category}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{course.region}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#FF6F42] text-[#FF6F42]" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{course.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
