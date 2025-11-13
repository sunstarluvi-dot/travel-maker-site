export type Price = {
  total?: number
  transport?: number
  accommodation?: number
  tickets?: number
}

export type DayEvent = {
  time?: string
  title: string
  location?: string
  description?: string
}

export type TimelineDay = {
  day: number
  title: string
  events: DayEvent[]
}

export type LimitedPeriod = {
  isLimited: boolean
  startDate?: string
  endDate?: string
  status?: "진행 중" | "예정" | "종료"
}

export type Course = {
  id: number
  title: string
  region: string
  province?: "경기도" | "경상도" | "전라도" | "충청도" | "강원도" | "제주도"
  category: string
  categoryType?: "여행상품" | "특산품" | "굿즈"
  description: string
  image: string
  image2?: string
  image3?: string
  days: number
  price: Price
  difficulty: number | string
  transportation: string[]
  petFriendly: boolean
  likes: number
  rating: number
  comments: number
  halalCertified?: boolean
  officialCertified?: boolean
  author?: string
  hashtags?: string[]
  detailedDescription?: string
  createdAt?: string
  timeline?: TimelineDay[]
  mapCoordinates?: { lat: number; lng: number }[]
  limitedPeriod?: LimitedPeriod
}

export type AdItem = {
  id: string
  title: string
  image: string
  href: string
  badge?: string
}
