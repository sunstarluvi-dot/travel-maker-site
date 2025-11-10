import type { Course } from "./types"

export function normalizeCourse(raw: any): Course {
  const cat = (raw.category || "").trim().toLowerCase()
  let categoryType: "여행상품" | "특산품" | "굿즈" = "여행상품"

  // Auto-detect category type from category name or description
  if (/특산|local.*product|specialty|지역.*상품/i.test(cat) || /특산|지역상품/i.test(raw.description || "")) {
    categoryType = "특산품"
  } else if (/굿즈|goods|merch|merchandise|기념품/i.test(cat) || /굿즈|기념품/i.test(raw.description || "")) {
    categoryType = "굿즈"
  }

  return {
    ...raw,
    category: raw.category || "",
    categoryType: raw.categoryType || categoryType,
  } as Course
}

export function normalizeCourses(arr: any[]): Course[] {
  return (Array.isArray(arr) ? arr : []).map(normalizeCourse)
}
