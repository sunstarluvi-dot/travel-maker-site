import type { AdItem } from "@/lib/types"

export default function AdBannerNew({ ad }: { ad: AdItem | null }) {
  if (!ad) return null

  return (
    <a
      href={ad.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl overflow-hidden soft-shadow hover:shadow-lg transition-all bg-white"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-white">
        <img src={ad.image || "/placeholder.svg"} alt={ad.title} className="h-full w-full object-contain" />
      </div>
      <div className="p-3">
        <div className="text-sm font-semibold truncate">{ad.title}</div>
        {ad.badge && (
          <span className="mt-1 inline-flex text-[11px] rounded-full px-2 py-0.5 bg-orange-100 text-orange-700">
            {ad.badge}
          </span>
        )}
      </div>
    </a>
  )
}
