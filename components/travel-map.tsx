"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "lucide-react"

interface TravelMapProps {
  title: string
  coordinates?: { lat: number; lng: number }[]
}

const BAEHWA_COORDS = { lat: 37.5678, lng: 126.9613 }

export default function TravelMap({ title, coordinates = [] }: TravelMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  // Full route: 배화여대 → coordinates
  const fullRoute = [BAEHWA_COORDS, ...coordinates]

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const container = containerRef.current
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply zoom and pan
    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(zoom, zoom)

    // Convert lat/lng to canvas coordinates (simple projection)
    const latRange = 0.1 // Approx 11km
    const lngRange = 0.1
    const centerLat = BAEHWA_COORDS.lat
    const centerLng = BAEHWA_COORDS.lng

    const toCanvasCoords = (lat: number, lng: number) => {
      const x = ((lng - centerLng + lngRange / 2) / lngRange) * canvas.width
      const y = ((centerLat - lat + latRange / 2) / latRange) * canvas.height
      return { x, y }
    }

    // Draw route lines with animation
    if (fullRoute.length > 1) {
      ctx.strokeStyle = "#3A9CFD"
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      for (let i = 0; i < fullRoute.length - 1; i++) {
        const start = toCanvasCoords(fullRoute[i].lat, fullRoute[i].lng)
        const end = toCanvasCoords(fullRoute[i + 1].lat, fullRoute[i + 1].lng)

        const segmentProgress = Math.max(0, Math.min(1, animationProgress * fullRoute.length - i))

        if (segmentProgress > 0) {
          ctx.beginPath()
          ctx.moveTo(start.x, start.y)
          const currentX = start.x + (end.x - start.x) * segmentProgress
          const currentY = start.y + (end.y - start.y) * segmentProgress
          ctx.lineTo(currentX, currentY)
          ctx.stroke()
        }
      }
    }

    // Draw markers
    fullRoute.forEach((coord, index) => {
      const pos = toCanvasCoords(coord.lat, coord.lng)

      // Marker circle
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, index === 0 ? 12 : 8, 0, 2 * Math.PI)
      ctx.fillStyle = index === 0 ? "#FF6F42" : "#3A9CFD"
      ctx.fill()
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Label for starting point
      if (index === 0) {
        ctx.fillStyle = "#000"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("배화여대", pos.x, pos.y - 20)
      }
    })

    ctx.restore()
  }, [animationProgress, offset, zoom, coordinates])

  // Start animation
  useEffect(() => {
    const startTime = Date.now()
    const duration = 1200 // 1.2s

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(1, elapsed / duration)
      setAnimationProgress(progress)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [])

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((prev) => Math.max(0.5, Math.min(3, prev * delta)))
  }

  const resetView = () => {
    setOffset({ x: 0, y: 0 })
    setZoom(1)
    setAnimationProgress(0)
    setTimeout(() => {
      const startTime = Date.now()
      const duration = 1200

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(1, elapsed / duration)
        setAnimationProgress(progress)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }, 100)
  }

  return (
    <Card className="soft-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD]">
            여행 경로 지도
          </h2>
          <Button variant="outline" size="sm" onClick={resetView} className="gap-2 bg-transparent">
            <Navigation className="w-4 h-4" />
            초기화
          </Button>
        </div>

        <div
          ref={containerRef}
          className="relative w-full h-[400px] bg-muted/30 rounded-lg overflow-hidden cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <canvas ref={canvasRef} className="w-full h-full" />

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-3 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FF6F42]" />
              <span>출발: 배화여대</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#3A9CFD]" />
              <span>경유지</span>
            </div>
          </div>

          {/* Controls hint */}
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-muted-foreground">
            마우스 드래그: 이동 | 스크롤: 확대/축소
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
