import { type Province, PROVINCES, CITIES_BY_PROVINCE } from "./constants"
import type { Course } from "./types"

const CITY_TO_PROVINCE: Record<string, Province> = {}

// Build reverse mapping from CITIES_BY_PROVINCE
Object.entries(CITIES_BY_PROVINCE).forEach(([province, cities]) => {
  cities.forEach((city) => {
    if (city !== "전체") {
      CITY_TO_PROVINCE[city] = province as Province
    }
  })
})

// Additional mappings for variations and specific cases
Object.assign(CITY_TO_PROVINCE, {
  // 경기 variations
  수원시: "경기도",
  평택시: "경기도",
  가평군: "경기도",
  양평군: "경기도",
  광주: "경기도", // 경기 광주

  // 경상 variations (including metropolitan cities)
  부산광역시: "경상도",
  부산시: "경상도",
  대구광역시: "경상도",
  대구시: "경상도",
  울산광역시: "경상도",
  울산시: "경상도",
  거제시: "경상도",
  하동군: "경상도",
  남해군: "경상도",
  안동시: "경상도",

  // 전라 variations
  광주광역시: "전라도",
  전주시: "전라도",
  목포시: "전라도",
  여수시: "전라도",
  순천시: "전라도",
  담양군: "전라도",
  보성군: "전라도",
  군산시: "전라도",
  완도군: "전라도",
  "전남 완도": "전라도",
  "전남 순천": "전라도",
  "전남 담양": "전라도",
  "전남 보성": "전라도",

  // 충청 variations
  대전광역시: "충청도",
  대전시: "충청도",
  청주시: "충청도",
  천안시: "충청도",
  공주시: "충청도",
  보령시: "충청도",
  아산시: "충청도",
  서산시: "충청도",

  // 강원 variations
  춘천시: "강원도",
  강릉시: "강원도",
  속초시: "강원도",
  원주시: "강원도",
  삼척시: "강원도",
  양양군: "강원도",
  정선군: "강원도",

  // 제주 variations
  제주시: "제주도",
  서귀포시: "제주도",
  우도: "제주도",

  // 경기 additional
  안성: "경기도",
  "경기 안성": "경기도",

  // 경상 additional
  "경북 영양": "경상도",
  "경북 봉화": "경상도",
  영양군: "경상도",
  봉화군: "경상도",
})

/**
 * Infer province from text by matching city names
 */
export function inferProvinceFromText(text?: string): Province | undefined {
  if (!text) return undefined

  const normalized = text.replace(/\s+/g, " ").trim()

  // Sort keys by length (longest first) for better matching
  const keys = Object.keys(CITY_TO_PROVINCE).sort((a, b) => b.length - a.length)

  for (const key of keys) {
    if (normalized.includes(key)) {
      return CITY_TO_PROVINCE[key]
    }
  }

  return undefined
}

/**
 * Normalize province field for a course
 */
export function normalizeProvince(course: Course): Province | undefined {
  // If province already exists and is valid, return it
  if (course.province && PROVINCES.includes(course.province as Province)) {
    return course.province as Province
  }

  // Try to infer from region field
  const fromRegion = inferProvinceFromText(course.region)
  if (fromRegion) return fromRegion

  // Try to infer from category
  const fromCategory = inferProvinceFromText(course.category)
  if (fromCategory) return fromCategory

  // Try to infer from hashtags
  if (course.hashtags && course.hashtags.length > 0) {
    const fromHashtags = inferProvinceFromText(course.hashtags.join(" "))
    if (fromHashtags) return fromHashtags
  }

  return undefined
}

/**
 * Add province field to course
 */
export function withProvince<T extends Course>(course: T): T {
  const province = normalizeProvince(course)
  return { ...course, province }
}

/**
 * Get courses by province
 */
export function filterByProvince(courses: Course[], province?: Province | null): Course[] {
  if (!province) return courses
  return courses.filter((c) => c.province === province)
}

/**
 * Get courses by province and city
 */
export function filterByProvinceAndCity(courses: Course[], province?: Province | null, city?: string | null): Course[] {
  let filtered = courses

  if (province) {
    filtered = filterByProvince(filtered, province)
  }

  if (city && city !== "전체") {
    filtered = filtered.filter((c) => {
      const region = c.region || ""
      return region.includes(city)
    })
  }

  return filtered
}

/**
 * Count courses by province
 */
export function countByProvince(courses: Course[]): Record<Province, number> {
  const counts = {} as Record<Province, number>

  // Initialize all provinces with 0
  PROVINCES.forEach((p) => {
    counts[p] = 0
  })

  // Count courses
  courses.forEach((course) => {
    if (course.province) {
      counts[course.province]++
    }
  })

  return counts
}
