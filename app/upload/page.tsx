"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Train, Bus, BugPlay as Subway, PawPrint } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Checkbox } from "@/components/ui/checkbox"
import LeftSidebar from "@/components/left-sidebar"
import RightSidebar from "@/components/right-sidebar"
import MobileSidebarButton from "@/components/mobile-sidebar-button"
import { useToast } from "@/hooks/use-toast"

export default function UploadPage() {
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    region: "",
    category: "",
    days: "",
    description: "",
    priceTotal: "",
    priceTransport: "",
    priceAccommodation: "",
    priceTickets: "",
    difficulty: "",
    petFriendly: false,
  })

  const [selectedTransportation, setSelectedTransportation] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "등록 완료!",
      description: "여행 코스가 성공적으로 등록되었습니다.",
    })
    setFormData({
      title: "",
      region: "",
      category: "",
      days: "",
      description: "",
      priceTotal: "",
      priceTransport: "",
      priceAccommodation: "",
      priceTickets: "",
      difficulty: "",
      petFriendly: false,
    })
    setSelectedTransportation([])
  }

  const toggleTransportation = (transport: string) => {
    setSelectedTransportation((prev) =>
      prev.includes(transport) ? prev.filter((t) => t !== transport) : [...prev, transport],
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex gap-6">
          <LeftSidebar />

          <main className="flex-1 min-w-0">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD]">
                  여행 코스 등록
                </h1>
                <p className="text-muted-foreground">당신만의 특별한 로컬 여행 코스를 공유해주세요</p>
              </div>

              <Card className="soft-shadow">
                <CardHeader>
                  <CardTitle>코스 정보</CardTitle>
                  <CardDescription>여행 코스의 상세 정보를 입력해주세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-2">
                      <Label htmlFor="title">제목</Label>
                      <Input
                        id="title"
                        placeholder="예: 순천 골목 속 감성 산책 하루"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="region">지역</Label>
                        <Input
                          id="region"
                          placeholder="예: 순천"
                          value={formData.region}
                          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">카테고리</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                          required
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="로컬">로컬</SelectItem>
                            <SelectItem value="카페">카페</SelectItem>
                            <SelectItem value="맛집">맛집</SelectItem>
                            <SelectItem value="자연">자연</SelectItem>
                            <SelectItem value="문화">문화</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="days">일정 (일)</Label>
                        <Input
                          id="days"
                          type="number"
                          min="1"
                          placeholder="예: 1"
                          value={formData.days}
                          onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-[#3A9CFD]/5 to-[#FF6F42]/5">
                      <h3 className="font-bold text-sm">예상 가격 (원)</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="priceTransport" className="text-xs">
                            교통비
                          </Label>
                          <Input
                            id="priceTransport"
                            type="number"
                            placeholder="15000"
                            value={formData.priceTransport}
                            onChange={(e) => setFormData({ ...formData, priceTransport: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priceAccommodation" className="text-xs">
                            숙박비
                          </Label>
                          <Input
                            id="priceAccommodation"
                            type="number"
                            placeholder="0"
                            value={formData.priceAccommodation}
                            onChange={(e) => setFormData({ ...formData, priceAccommodation: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priceTickets" className="text-xs">
                            입장료
                          </Label>
                          <Input
                            id="priceTickets"
                            type="number"
                            placeholder="30000"
                            value={formData.priceTickets}
                            onChange={(e) => setFormData({ ...formData, priceTickets: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priceTotal" className="text-xs">
                            총 예상 가격
                          </Label>
                          <Input
                            id="priceTotal"
                            type="number"
                            placeholder="45000"
                            value={formData.priceTotal}
                            onChange={(e) => setFormData({ ...formData, priceTotal: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">난이도 (1-5)</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                        required
                      >
                        <SelectTrigger id="difficulty">
                          <SelectValue placeholder="선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - 매우 쉬움</SelectItem>
                          <SelectItem value="2">2 - 쉬움</SelectItem>
                          <SelectItem value="3">3 - 보통</SelectItem>
                          <SelectItem value="4">4 - 어려움</SelectItem>
                          <SelectItem value="5">5 - 매우 어려움</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Transportation */}
                    <div className="space-y-3">
                      <Label>이동수단</Label>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { value: "KTX", icon: Train, label: "KTX" },
                          { value: "버스", icon: Bus, label: "버스" },
                          { value: "지하철", icon: Subway, label: "지하철" },
                        ].map(({ value, icon: Icon, label }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => toggleTransportation(value)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                              selectedTransportation.includes(value)
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pet Friendly */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="petFriendly"
                        checked={formData.petFriendly}
                        onCheckedChange={(checked) => setFormData({ ...formData, petFriendly: checked as boolean })}
                      />
                      <label
                        htmlFor="petFriendly"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                      >
                        <PawPrint className="w-4 h-4 text-[#FF6F42]" />
                        반려동물 동반 가능
                      </label>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">상세 설명</Label>
                      <Textarea
                        id="description"
                        placeholder="현지인만 아는 숨은 명소와 로컬 맛집을 소개해주세요..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="min-h-[200px]"
                        required
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="image">이미지 업로드</Label>
                      <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer soft-shadow">
                        <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-1">클릭하여 이미지를 업로드하세요</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG (최대 10MB)</p>
                        <input id="image" type="file" accept="image/*" className="hidden" />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD] hover:opacity-90 transition-opacity"
                    >
                      등록하기
                    </Button>
                  </form>
                </CardContent>
              </Card>
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
