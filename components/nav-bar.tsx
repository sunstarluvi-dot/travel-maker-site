"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plane } from "lucide-react"

export default function NavBar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-primary hover:text-primary/80 transition-colors"
          >
            <Plane className="w-6 h-6" />
            <span>TRAVEL MAKER</span>
          </Link>

          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={`font-medium transition-colors ${
                isActive("/") &&
                !pathname.includes("/course") &&
                !pathname.includes("/upload") &&
                !pathname.includes("/explore")
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              홈
            </Link>
            <Link
              href="/upload"
              className={`font-medium transition-colors ${
                isActive("/upload") ? "text-primary" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              등록
            </Link>
            <Link
              href="/explore"
              className={`font-medium transition-colors ${
                isActive("/explore") ? "text-primary" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              탐색
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
