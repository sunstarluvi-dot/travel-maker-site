import type { Course } from "./types"
import { normalizeCourses } from "./normalize-course"
import { SEED_SPECIALTY_ITEMS, SEED_GOODS_ITEMS, generateMockItems } from "./seed-data"

let cache: Course[] | null = null

// Helper to merge seed data with fetched data
export function mergeWithSeedData(fetchedCourses: Course[]): Course[] {
  const specialtyItems = fetchedCourses.filter((c) => c.categoryType === "특산품")
  const goodsItems = fetchedCourses.filter((c) => c.categoryType === "굿즈")

  // Use seed data if fetched data is empty, otherwise use fetched data
  const finalSpecialty = specialtyItems.length > 0 ? specialtyItems : SEED_SPECIALTY_ITEMS
  const finalGoods = goodsItems.length > 0 ? goodsItems : SEED_GOODS_ITEMS

  // Keep travel items as-is
  const travelItems = fetchedCourses.filter((c) => c.categoryType === "여행상품" || !c.categoryType)

  return [...travelItems, ...finalSpecialty, ...finalGoods]
}

export async function getAllCourses(): Promise<Course[]> {
  if (cache) return cache

  try {
    const res = await fetch("/data/courses.json", { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch courses")
    const data = await res.json()
    const normalized = normalizeCourses(data)
    cache = mergeWithSeedData(normalized)
    return cache
  } catch (error) {
    console.error("Error fetching courses:", error)
    return [...SEED_SPECIALTY_ITEMS, ...SEED_GOODS_ITEMS]
  }
}

export async function getCourseById(id: number): Promise<Course | undefined> {
  const list = await getAllCourses()
  return list.find((c) => c.id === id)
}

// Helper to get items by category with fail-safe
export async function getItemsByCategory(categoryType: "여행상품" | "특산품" | "굿즈"): Promise<Course[]> {
  const all = await getAllCourses()
  const filtered = all.filter((c) => c.categoryType === categoryType)

  // Fail-safe: generate mocks if empty
  if (filtered.length === 0 && categoryType !== "여행상품") {
    return generateMockItems(categoryType)
  }

  return filtered
}
