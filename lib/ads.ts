export type AdItem = {
  id: string
  title: string
  image: string
  href: string
  badge?: string
}

export const AD_POOL: AdItem[] = [
  {
    id: "local-honey",
    title: "순천 야생화 꿀 세트",
    image: "/honey-jar-flowers.png",
    href: "https://example.com/honey",
    badge: "지역특산품",
  },
  {
    id: "dried-seaweed",
    title: "완도 재래김 선물세트",
    image: "/seaweed-gift-set.jpg",
    href: "https://example.com/seaweed",
    badge: "제휴특가",
  },
  {
    id: "handmade-mug",
    title: "핸드메이드 머그·굿즈",
    image: "/handmade-ceramic-mug.jpg",
    href: "https://example.com/mug",
    badge: "굿즈",
  },
  {
    id: "hanok-stay-coupon",
    title: "한옥스테이 10% 쿠폰",
    image: "/traditional-hanok-stay.jpg",
    href: "https://example.com/hanok",
    badge: "추천",
  },
]

function pickIndex(seed: number, max: number) {
  return max ? seed % max : 0
}

export function pickTwoDistinctAds(): [AdItem, AdItem] {
  const pool = AD_POOL
  if (pool.length <= 1) return [pool[0], pool[0]]

  const key = new Date().toDateString()
  const saved = typeof window !== "undefined" ? sessionStorage.getItem("tm-last-ads") : null

  let aIdx = 0,
    bIdx = 1

  if (saved) {
    try {
      const { a, b, d } = JSON.parse(saved)
      if (d === key) {
        aIdx = Math.min(a, pool.length - 1)
        bIdx = Math.min(b, pool.length - 1)
      }
    } catch {}
  } else {
    const base = Date.now()
    aIdx = pickIndex(base, pool.length)
    bIdx = pickIndex(base + 1, pool.length)
  }

  if (aIdx === bIdx) bIdx = (bIdx + 1) % pool.length

  if (typeof window !== "undefined") {
    sessionStorage.setItem("tm-last-ads", JSON.stringify({ a: aIdx, b: bIdx, d: key }))
  }

  return [pool[aIdx], pool[bIdx]]
}
