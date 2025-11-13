"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Calendar, Heart, Star, MessageCircle, Train, Bus, BugPlay as Subway, PawPrint } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TravelCardProps {
  id: number
  title: string
  region: string
  category: string
  description: string
  image: string
  days: number
  price: {
    total: number
    transport: number
    accommodation: number
    tickets: number
  }
  difficulty: number
  transportation: string[]
  petFriendly: boolean
  likes: number
  rating: number
  comments: number
  halalCertified?: boolean
  officialCertified?: boolean
}

const transportIcons: Record<string, any> = {
  KTX: Train,
  버스: Bus,
  지하철: Subway,
}

export default function TravelCard({
  id,
  title,
  region,
  category,
  description,
  image,
  days,
  price,
  difficulty,
  transportation,
  petFriendly,
  likes,
  rating,
  comments,
  halalCertified,
  officialCertified,
}: TravelCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currentLikes, setCurrentLikes] = useState(likes)

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    setIsWishlisted(wishlist.includes(id))
  }, [id])

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    let newWishlist: number[]

    if (isWishlisted) {
      newWishlist = wishlist.filter((courseId: number) => courseId !== id)
      setCurrentLikes((prev) => prev - 1)
    } else {
      newWishlist = [...wishlist, id]
      setCurrentLikes((prev) => prev + 1)
    }

    localStorage.setItem("wishlist", JSON.stringify(newWishlist))
    setIsWishlisted(!isWishlisted)

    window.dispatchEvent(new Event("wishlistChanged"))
  }

  const isTravelProduct = days > 0 && transportation && transportation.length > 0

  return (
    <Link href={`/course/${id}`}>
      <div className="group rounded-2xl overflow-hidden soft-shadow bg-white hover:soft-shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden gradient-overlay">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <button
            onClick={toggleWishlist}
            className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center soft-shadow hover:scale-110 transition-transform z-10"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isWishlisted ? "fill-[#FF6F42] text-[#FF6F42]" : "text-muted-foreground"
              }`}
            />
          </button>
          {isTravelProduct && (
            <div className="absolute top-3 right-3 flex gap-2">
              {halalCertified && (
                <div className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center soft-shadow p-1.5">
                  <img
                    src="/images/halal_icon.jpg"
                    alt="Halal Certification"
                    className="w-full h-full object-contain"
                  />
             </div>
              )}

              {officialCertified && (
                <div className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center soft-shadow p-1.5">
                 <img
                   src="/brand/logo.jpg"
                   alt="공식 인증"
                   className="w-full h-full object-contain"
                   loading="lazy"
                   decoding="async"
                 />
               </div>
              )}

              {petFriendly && (
                <div className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center soft-shadow">
                  <PawPrint className="w-4 h-4 text-[#FF6F42]" />
                </div>
              )}
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <Badge className="bg-white/95 backdrop-blur-sm text-foreground hover:bg-white/95 text-xs px-3 py-1">
              {category}
            </Badge>
            {isTravelProduct && (
              <div className="flex items-center gap-1.5">
                {transportation.slice(0, 2).map((transport, index) => {
                  const Icon = transportIcons[transport]
                  return Icon ? (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center soft-shadow"
                    >
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  ) : null
                })}
              </div>
            )}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-3">
            <h3 className="font-bold text-lg mb-1.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
              {title}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>{region}</span>
              {isTravelProduct && (
                <>
                  <span className="mx-1">•</span>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{days}일</span>
                </>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{description}</p>

          <div className="flex items-center justify-between mb-4 pb-4 border-b mt-auto">
            <div>
              <div className="text-xs text-muted-foreground mb-1">{isTravelProduct ? "예상 가격" : "판매 가격"}</div>
              <div className="font-bold text-lg text-primary">{(price.total || 0).toLocaleString()}원</div>
            </div>
            {isTravelProduct && typeof difficulty === "number" && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">난이도</div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-1.5 h-4 rounded-full ${i < difficulty ? "bg-secondary" : "bg-muted"}`} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#FF6F42] text-[#FF6F42]" : ""}`} />
              <span className="font-medium">{currentLikes}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-[#FF6F42] text-[#FF6F42]" />
              <span className="font-medium">{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">{comments}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
