"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { PROVINCES, type Province, CITIES_BY_PROVINCE } from "@/lib/constants"

export function useProvinceFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const [province, setProvinceState] = useState<Province | "">("")
  const [city, setCity] = useState<string>("")

  useEffect(() => {
    const p = sp.get("province")
    if (p && (PROVINCES as readonly string[]).includes(p)) {
      setProvinceState(p as Province)
    }
    const c = sp.get("city")
    if (c) {
      setCity(c)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cities = useMemo(() => {
    return province ? CITIES_BY_PROVINCE[province] || ["전체"] : ["전체"]
  }, [province])

  const setProvince = (p: Province | "") => {
    setProvinceState(p)
    setCity("")
  }

  const applyToURL = () => {
    const params = new URLSearchParams(sp?.toString() || "")

    if (province) {
      params.set("province", province)
    } else {
      params.delete("province")
    }

    if (city && city !== "전체") {
      params.set("city", city)
    } else {
      params.delete("city")
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return {
    PROVINCES,
    province,
    setProvince,
    city,
    setCity,
    cities,
    applyToURL,
  }
}
