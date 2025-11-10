"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const banners = [
  {
    id: 1,
    title: "지역 특산물과 함께하는 여행",
    subtitle: "현지 맛집과 특산물을 한번에",
    image: "/korean-local-market-with-traditional-products.jpg",
    gradient: "from-[#FF6F42]/80 to-[#3A9CFD]/80",
  },
  {
    id: 2,
    title: "반려동물과 함께하는 여행",
    subtitle: "펫프렌들리 코스 모음",
    image: "/pet-friendly-travel-destination-in-korea.jpg",
    gradient: "from-[#3A9CFD]/80 to-[#FF6F42]/80",
  },
  {
    id: 3,
    title: "현지인만 아는 숨은 명소",
    subtitle: "로컬 크리에이터 추천 코스",
    image: "/hidden-local-spots-in-korean-countryside.jpg",
    gradient: "from-[#C9C9C9]/80 to-[#3A9CFD]/80",
  },
]

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  return (
    <div className="relative w-full h-[400px] rounded-3xl overflow-hidden soft-shadow-lg group">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={banner.image || "/placeholder.svg"} alt={banner.title} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{banner.title}</h2>
            <p className="text-lg md:text-xl opacity-90">{banner.subtitle}</p>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "bg-white w-8" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  )
}
