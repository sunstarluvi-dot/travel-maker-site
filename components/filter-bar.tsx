"use client"

import { useState } from "react"
import { X, Search, RotateCcw, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterBarProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterValues) => void
  onResetFilters: () => void
}

export interface FilterValues {
  province: string
  city: string
  category: string
  duration: string
  priceRange: [number, number]
  petFriendly: boolean
  dateRange: {
    start: string
    end: string
  }
  difficulty: string
}

const provinceCityMap: Record<string, string[]> = {
  전체: ["전체"],
  강원도: ["전체", "춘천", "원주", "강릉", "동해", "태백", "속초", "삼척"],
  경상북도: ["전체", "포항", "경주", "김천", "안동", "구미", "영주", "영천", "상주", "문경", "경산"],
  경상남도: ["전체", "창원", "진주", "통영", "사천", "김해", "밀양", "거제", "양산"],
  전라북도: ["전체", "전주", "군산", "익산", "정읍", "남원", "김제"],
  전라남도: ["전체", "목포", "여수", "순천", "나주", "광양", "보성"],
  충청북도: ["전체", "청주", "충주", "제천", "당진"],
  충청남도: ["전체", "천안", "공주", "보령", "아산", "서산", "논산", "계룡", "당진", "부여"],
  제주도: ["전체", "제주시", "서귀포"],
}

const categories = ["전체", "로컬", "카페", "맛집", "자연", "문화", "역사"]
const durations = ["전체", "1일", "2박 3일", "3박 4일", "4박 5일"]
const difficulties = ["전체", "1 (매우 쉬움)", "2 (쉬움)", "3 (보통)", "4 (어려움)", "5 (매우 어려움)"]

export default function FilterBar({ isOpen, onClose, onApplyFilters, onResetFilters }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState<FilterValues>({
    province: "전체",
    city: "전체",
    category: "전체",
    duration: "전체",
    priceRange: [0, 500000],
    petFriendly: false,
    dateRange: {
      start: "",
      end: "",
    },
    difficulty: "전체",
  })

  const handleProvinceChange = (value: string) => {
    setFilters({ ...filters, province: value, city: "전체" })
  }

  const availableCities = provinceCityMap[filters.province] || ["전체"]

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters: FilterValues = {
      province: "전체",
      city: "전체",
      category: "전체",
      duration: "전체",
      priceRange: [0, 500000],
      petFriendly: false,
      dateRange: {
        start: "",
        end: "",
      },
      difficulty: "전체",
    }
    setFilters(resetFilters)
    setShowAdvanced(false)
    onResetFilters()
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Filter Panel */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-2xl soft-shadow-lg z-50 p-6 mx-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top slide-distance-lg duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD]">
            여행 코스 필터
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">기본 필터</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Province Filter */}
            <div className="space-y-2">
              <Label htmlFor="province" className="text-sm font-semibold">
                지역 (도)
              </Label>
              <Select value={filters.province} onValueChange={handleProvinceChange}>
                <SelectTrigger id="province" className="w-full">
                  <SelectValue placeholder="도 선택" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(provinceCityMap).map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Filter - Cascading based on province */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-semibold">
                도시
              </Label>
              <Select
                value={filters.city}
                onValueChange={(value) => setFilters({ ...filters, city: value })}
                disabled={filters.province === "전체"}
              >
                <SelectTrigger id="city" className="w-full">
                  <SelectValue placeholder="도시 선택" />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold">
                카테고리
              </Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration Filter */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-semibold">
                여행 기간
              </Label>
              <Select value={filters.duration} onValueChange={(value) => setFilters({ ...filters, duration: value })}>
                <SelectTrigger id="duration" className="w-full">
                  <SelectValue placeholder="기간 선택" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full justify-between hover:bg-gradient-to-r hover:from-[#3A9CFD]/10 hover:to-[#FF6F42]/10 transition-all"
          >
            <span className="font-semibold">고급 필터</span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {showAdvanced && (
          <div className="space-y-4 mb-6 animate-in slide-in-from-top slide-distance-sm duration-300">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">고급 필터</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price Range Filter */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="priceRange" className="text-sm font-semibold">
                  가격 범위: {filters.priceRange[0].toLocaleString()}원 - {filters.priceRange[1].toLocaleString()}원
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="range"
                    min="0"
                    max="500000"
                    step="10000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ ...filters, priceRange: [0, Number.parseInt(e.target.value)] })}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Difficulty Level Filter */}
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-sm font-semibold">
                  난이도
                </Label>
                <Select
                  value={filters.difficulty}
                  onValueChange={(value) => setFilters({ ...filters, difficulty: value })}
                >
                  <SelectTrigger id="difficulty" className="w-full">
                    <SelectValue placeholder="난이도 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pet Friendly Filter */}
              <div className="space-y-2 flex items-center gap-2 pt-6">
                <Checkbox
                  id="petFriendly"
                  checked={filters.petFriendly}
                  onCheckedChange={(checked) => setFilters({ ...filters, petFriendly: checked as boolean })}
                />
                <Label htmlFor="petFriendly" className="text-sm font-semibold cursor-pointer">
                  🐾 반려동물 동반 가능
                </Label>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-semibold">
                  시작 날짜
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    setFilters({ ...filters, dateRange: { ...filters.dateRange, start: e.target.value } })
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-semibold">
                  종료 날짜
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, end: e.target.value } })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="gap-2 bg-transparent hover:bg-muted">
            <RotateCcw className="w-4 h-4" />
            초기화
          </Button>
          <Button
            onClick={handleApply}
            className="gap-2 bg-gradient-to-r from-[#3A9CFD] to-[#FF6F42] text-white hover:shadow-lg transition-all"
          >
            <Search className="w-4 h-4" />
            검색
          </Button>
        </div>
      </div>
    </>
  )
}
