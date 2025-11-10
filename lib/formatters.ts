import type { Price } from "./types"

export const computeTotal = (p: Price): number => {
  const sum = (p.transport || 0) + (p.accommodation || 0) + (p.tickets || 0)
  return p.total ?? (sum > 0 ? sum : 0)
}

export const formatKRW = (n: number) => (n || 0).toLocaleString("ko-KR") + "원"

export const difficultyArray = (n: number) => Array.from({ length: 5 }, (_, i) => i < (n || 0))

export const difficultyText = (n: number): string => {
  if (n <= 1) return "Easy"
  if (n <= 3) return "Medium"
  return "Hard"
}

export const difficultyDescription = (text: string): string => {
  if (text === "Easy") return "쉬운 코스입니다"
  if (text === "Medium") return "보통 난이도입니다"
  if (text === "Hard") return "어려운 코스입니다"
  return "보통 난이도입니다"
}
