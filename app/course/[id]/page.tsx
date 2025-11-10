"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Star, MapPin, Calendar, User, Train, Bus, BugPlay as Subway, PawPrint } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import TimelineViewer from "@/components/timeline-viewer"
import SimilarCourses from "@/components/similar-courses"
import TravelMap from "@/components/travel-map"
import SubscribeButton from "@/components/subscribe-button"
import { getCourseById } from "@/lib/course"
import { computeTotal, difficultyText, difficultyDescription } from "@/lib/formatters"
import type { Course } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function CourseDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const { toast } = useToast()

  const [course, setCourse] = useState<Course | null>(null)
  const [liked, setLiked] = useState(false)
  const [review, setReview] = useState("")
  const [reviewName, setReviewName] = useState("")
  const [reviewRating, setReviewRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isManualTransition, setIsManualTransition] = useState(false)
  const autoSlideTimerRef = useRef<NodeJS.Timeout>()

  const courseImages = [
    course?.image || "/placeholder.svg",
    course?.image2 || "/scenic-view.jpg",
    course?.image3 || "/local-experience.jpg",
  ]

  useEffect(() => {
    const loadCourse = async () => {
      const data = await getCourseById(id)
      if (data) setCourse(data)
    }
    loadCourse()
  }, [id])

  useEffect(() => {
    if (!course) return

    autoSlideTimerRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % courseImages.length)
    }, 5000)

    return () => {
      if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current)
    }
  }, [course, courseImages.length])

  const handleManualImageChange = (newIndex: number) => {
    if (isManualTransition) return

    if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current)

    setIsManualTransition(true)

    setTimeout(() => {
      setCurrentImageIndex(newIndex)

      setTimeout(() => {
        setIsManualTransition(false)

        autoSlideTimerRef.current = setInterval(() => {
          setCurrentImageIndex((prev) => (prev + 1) % courseImages.length)
        }, 5000)
      }, 2200 + 800)
    }, 500)
  }

  const handleNextImage = () => {
    const newIndex = (currentImageIndex + 1) % courseImages.length
    handleManualImageChange(newIndex)
  }

  const handlePrevImage = () => {
    const newIndex = (currentImageIndex - 1 + courseImages.length) % courseImages.length
    handleManualImageChange(newIndex)
  }

  const handleSubmitReview = () => {
    if (!reviewName.trim()) {
      toast({
        title: "입력 오류",
        description: "이름을 입력해주세요.",
        variant: "destructive",
      })
      return
    }
    if (reviewRating === 0) {
      toast({
        title: "입력 오류",
        description: "별점을 선택해주세요.",
        variant: "destructive",
      })
      return
    }
    if (!review.trim()) {
      toast({
        title: "입력 오류",
        description: "후기 내용을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "후기 등록 완료",
      description: `${reviewName}님의 ${reviewRating}점 후기가 등록되었습니다.`,
    })
    setReviewName("")
    setReviewRating(0)
    setReview("")
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const priceTotal = computeTotal(course.price)
  const difficulty = difficultyText(course.difficulty)
  const transportIcons: Record<string, any> = {
    KTX: Train,
    버스: Bus,
    지하철: Subway,
  }

  const isTravelProduct = course.days > 0 && course.transportation && course.transportation.length > 0
  const isSpecialtyOrGoods = course.categoryType === "특산품" || course.categoryType === "굿즈"

  const creatorId = course.author ? `creator-${course.author.toLowerCase().replace(/\s+/g, "-")}` : undefined

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full h-[400px] md:h-[500px] overflow-hidden relative gradient-overlay">
        <div className="relative w-full h-full">
          <img
            src={courseImages[currentImageIndex] || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-full object-cover transition-opacity duration-700"
          />

          <button
            onClick={handlePrevImage}
            disabled={isManualTransition}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all z-10 disabled:opacity-50"
            aria-label="이전 이미지"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextImage}
            disabled={isManualTransition}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all z-10 disabled:opacity-50"
            aria-label="다음 이미지"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {courseImages.map((_, index) => (
              <button
                key={index}
                onClick={() => !isManualTransition && handleManualImageChange(index)}
                disabled={isManualTransition}
                className={`h-2 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-white w-6" : "bg-white/50 w-2"
                }`}
                aria-label={`이미지 ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity ${
            isManualTransition ? "duration-500 opacity-0" : "duration-800 opacity-100"
          }`}
        >
          <div className="absolute bottom-8 left-0 right-0 container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-white">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-white/90 backdrop-blur-sm text-foreground hover:bg-white/90">
                  {course.category}
                </Badge>
                {course.petFriendly && (
                  <Badge className="bg-[#FF6F42]/90 backdrop-blur-sm text-white hover:bg-[#FF6F42]/90">
                    <PawPrint className="w-3 h-3 mr-1" />
                    반려동물 동반 가능
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-balance">{course.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{course.region}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{course.days}일</span>
                </div>
                {course.author && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{course.author}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {course.author && (
            <Card className="soft-shadow mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3A9CFD] to-[#FF6F42]" />
                    <div>
                      <h3 className="font-bold">{course.author}</h3>
                      <p className="text-sm text-muted-foreground">로컬 여행 크리에이터</p>
                    </div>
                  </div>
                  <SubscribeButton creatorId={creatorId} creatorName={course.author} />
                </div>
              </CardContent>
            </Card>
          )}

          {isTravelProduct && !isSpecialtyOrGoods && (
            <Card className="soft-shadow mb-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">인증 정보</h2>
                <div className="flex flex-wrap items-center gap-4">
                  {course.halalCertified && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-[#3A9CFD]/10 to-[#FF6F42]/10 border border-[#3A9CFD]/20">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm p-2">
                        <img
                          src="/images/halal_icon.jpg"
                          alt="Halal Certification"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Halal Certification</p>
                        <p className="text-xs text-muted-foreground">할랄 인증 여행 코스</p>
                      </div>
                    </div>
                  )}
                  {course.officialCertified && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-[#FF6F42]/10 to-[#3A9CFD]/10 border border-[#FF6F42]/20">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm p-2">
                        <img
                          src="/images/official_cert_icon.jpg"
                          alt="Official Certification"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Official Certification</p>
                        <p className="text-xs text-muted-foreground">공식 인증 여행 코스</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {isTravelProduct && !isSpecialtyOrGoods && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="soft-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3A9CFD]/20 to-[#FF6F42]/20 flex items-center justify-center">
                      <span className="text-xl">💰</span>
                    </div>
                    <h3 className="font-bold">예상 가격</h3>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">{priceTotal.toLocaleString()}원</div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>교통비</span>
                      <span>{(course.price.transport || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span>입장료</span>
                      <span>{(course.price.tickets || 0).toLocaleString()}원</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="soft-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6F42]/20 to-[#3A9CFD]/20 flex items-center justify-center">
                      <span className="text-xl">⚡</span>
                    </div>
                    <h3 className="font-bold">난이도</h3>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">{difficulty}</div>
                  <p className="text-sm text-muted-foreground">{difficultyDescription(difficulty)}</p>
                </CardContent>
              </Card>

              <Card className="soft-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9C9C9]/30 to-[#3A9CFD]/20 flex items-center justify-center">
                      <span className="text-xl">🚆</span>
                    </div>
                    <h3 className="font-bold">이동수단</h3>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {course.transportation.map((transport, index) => {
                      const Icon = transportIcons[transport]
                      return (
                        <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                          {Icon && <Icon className="w-4 h-4 text-primary" />}
                          <span className="text-sm font-medium">{transport}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {isSpecialtyOrGoods && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="soft-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3A9CFD]/20 to-[#FF6F42]/20 flex items-center justify-center">
                      <span className="text-xl">💰</span>
                    </div>
                    <h3 className="font-bold">판매 가격</h3>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">
                    {(course.price.total || 0).toLocaleString()}원
                  </div>
                </CardContent>
              </Card>

              <Card className="soft-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6F42]/20 to-[#3A9CFD]/20 flex items-center justify-center">
                      <span className="text-xl">🏷️</span>
                    </div>
                    <h3 className="font-bold">태그</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(course.hashtags || []).slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 rounded-full border text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="soft-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9C9C9]/30 to-[#3A9CFD]/20 flex items-center justify-center">
                      <span className="text-xl">⭐</span>
                    </div>
                    <h3 className="font-bold">평점 / 리뷰</h3>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">{course.rating.toFixed(1)}</div>
                  <p className="text-sm text-muted-foreground">댓글 {course.comments}개</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="soft-shadow mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Heart className="w-5 h-5 text-[#FF6F42]" />
                    <span className="text-2xl font-bold">{course.likes}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">좋아요</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Star className="w-5 h-5 text-[#FF6F42] fill-[#FF6F42]" />
                    <span className="text-2xl font-bold">{course.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">평점</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-2xl font-bold">{course.comments}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">댓글</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="soft-shadow mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD]">
                여행 소개
              </h2>
              <div className="prose prose-sm max-w-none whitespace-pre-line text-foreground/90 leading-relaxed">
                {course.detailedDescription || course.description}
              </div>
            </CardContent>
          </Card>

          {isTravelProduct && !isSpecialtyOrGoods && course.timeline && course.timeline.length > 0 && (
            <div className="mb-8">
              <TimelineViewer timeline={course.timeline} />
            </div>
          )}

          {isTravelProduct && !isSpecialtyOrGoods && course.mapCoordinates && course.mapCoordinates.length > 0 && (
            <div className="mb-8">
              <TravelMap title={course.title} coordinates={course.mapCoordinates} />
            </div>
          )}

          {course.hashtags && course.hashtags.length > 0 && (
            <Card className="soft-shadow mb-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">해시태그</h2>
                <div className="flex flex-wrap gap-2">
                  {course.hashtags.map((tag: string) => (
                    <Badge
                      key={tag}
                      className="bg-gradient-to-r from-[#3A9CFD]/10 to-[#FF6F42]/10 text-foreground hover:from-[#3A9CFD]/20 hover:to-[#FF6F42]/20 border-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mb-8">
            <SimilarCourses currentCourse={course} limit={6} />
          </div>

          <Card className="soft-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">이 코스가 마음에 드시나요?</h2>
                <Button
                  variant={liked ? "default" : "outline"}
                  size="lg"
                  onClick={() => setLiked(!liked)}
                  className={`gap-2 ${liked ? "bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD] hover:opacity-90" : ""}`}
                >
                  <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                  찜하기
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">후기 작성</h3>

                <div className="space-y-2">
                  <Label htmlFor="review-name">Your Name</Label>
                  <Input
                    id="review-name"
                    placeholder="이름을 입력해주세요"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rate your experience</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="relative">
                        <button
                          type="button"
                          onClick={() => setReviewRating(star - 0.5)}
                          onMouseEnter={() => setHoverRating(star - 0.5)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="absolute left-0 w-1/2 h-full z-10"
                          aria-label={`${star - 0.5} stars`}
                        />
                        <button
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="absolute right-0 w-1/2 h-full z-10"
                          aria-label={`${star} stars`}
                        />
                        <div className="relative transition-transform hover:scale-110">
                          <Star
                            className={`w-8 h-8 ${
                              star <= (hoverRating || reviewRating)
                                ? "fill-[#FF6F42] text-[#FF6F42]"
                                : star - 0.5 === (hoverRating || reviewRating)
                                  ? "text-[#FF6F42]"
                                  : "text-muted-foreground"
                            }`}
                          />
                          {star - 0.5 === (hoverRating || reviewRating) && (
                            <div className="absolute inset-0 overflow-hidden w-1/2">
                              <Star className="w-8 h-8 fill-[#FF6F42] text-[#FF6F42]" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {reviewRating > 0 && (
                      <span className="ml-2 text-sm font-medium text-muted-foreground">
                        {reviewRating.toFixed(1)} / 5.0
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review-comment">Leave your comment</Label>
                  <Textarea
                    id="review-comment"
                    placeholder="이 여행 코스에 대한 후기를 남겨주세요..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <Button
                  onClick={handleSubmitReview}
                  className="w-full bg-gradient-to-r from-[#3A9CFD] to-[#FF6F42] hover:opacity-90"
                  size="lg"
                >
                  Submit Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
