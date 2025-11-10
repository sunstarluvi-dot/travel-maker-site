import type { Course } from "./types"

/**
 * AI-powered similar course recommendation engine
 * Priority: region > category > keywords
 */
export function getSimilarCourses(currentCourse: Course, allCourses: Course[], limit = 3): Course[] {
  if (!currentCourse) return []

  const scored = allCourses
    .filter((c) => c.id !== currentCourse.id)
    .map((course) => {
      let score = 0

      // Priority 1: Region match (highest weight)
      if (course.region === currentCourse.region) {
        score += 50
      }

      // Priority 2: Category match
      if (course.category === currentCourse.category) {
        score += 30
      }

      // Priority 3: Keyword/hashtag overlap
      const currentTags = currentCourse.hashtags || []
      const courseTags = course.hashtags || []
      const overlap = currentTags.filter((tag) => courseTags.includes(tag)).length
      score += overlap * 5

      // Bonus: Same categoryType (여행상품/특산품/굿즈)
      if (course.categoryType === currentCourse.categoryType) {
        score += 10
      }

      return { course, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.course)

  return scored
}
