"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronRight, MapPin, Clock } from "lucide-react"
import type { TimelineDay } from "@/lib/types"

interface TimelineViewerProps {
  timeline: TimelineDay[]
}

export default function TimelineViewer({ timeline }: TimelineViewerProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]))

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev)
      if (next.has(day)) {
        next.delete(day)
      } else {
        next.add(day)
      }
      return next
    })
  }

  if (!timeline || timeline.length === 0) return null

  return (
    <Card className="soft-shadow">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD]">
          일정 상세
        </h2>

        <div className="space-y-4">
          {timeline.map((day) => {
            const isExpanded = expandedDays.has(day.day)

            return (
              <div
                key={day.day}
                className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                  isExpanded ? "border-primary/30" : "border-border"
                }`}
              >
                {/* Day Header */}
                <button
                  onClick={() => toggleDay(day.day)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#3A9CFD]/5 to-[#FF6F42]/5 hover:from-[#3A9CFD]/10 hover:to-[#FF6F42]/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3A9CFD] to-[#FF6F42] flex items-center justify-center text-white font-bold">
                      {day.day}
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg">Day {day.day}</h3>
                      <p className="text-sm text-muted-foreground">{day.title}</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {/* Day Events (with fade-in animation) */}
                {isExpanded && (
                  <div className="px-6 py-4 space-y-4 animate-in fade-in duration-300">
                    {day.events.map((event, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 pb-4 last:pb-0 border-b last:border-b-0 animate-in fade-in slide-in-from-top duration-300"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="flex-shrink-0 w-1 bg-gradient-to-b from-[#3A9CFD] to-[#FF6F42] rounded-full" />
                        <div className="flex-1 space-y-2">
                          {event.time && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                          )}
                          <h4 className="font-semibold text-base">{event.title}</h4>
                          {event.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
