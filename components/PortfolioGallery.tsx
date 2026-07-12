'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import type { LightboxImage, PortfolioItem } from '@/lib/content'

// Fallback aspect ratio for the rare CMS media doc missing width/height —
// matches the grid's own aspect-[3/4] so a wrong guess still looks correct
// while it's still inside the aspect-locked card; only the lightbox (where
// it's used to size the full unconstrained view) would ever show a mismatch,
// and only for that edge case.
const FALLBACK_WIDTH = 1200
const FALLBACK_HEIGHT = 1600

// Decorative sigil overlays, rotated by index to keep the hand-made flavour of
// the original hardcoded grid without bespoke markup per item.
const sigilPaths = [
  'M50,10 Q90,50 50,90 Q10,50 50,10 M50,20 L50,80 M20,50 L80,50',
  'M50,50 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0 M10,10 L90,90 M90,10 L10,90',
  'M25,25 h50 v50 h-50 Z',
]

type Props = {
  items: PortfolioItem[]
  /** Localized "view" label shown on hover. */
  viewLabel: string
  /** Opens the lightbox with the given image (state lives in the parent). */
  onOpen: (image: LightboxImage) => void
  /** Localized "all" label for the filter bar (defaults to "ALL"). */
  allLabel?: string
}

/**
 * Data-driven portfolio grid. Mirrors the styling of the original hardcoded
 * grid (corner accents, grayscale, hover overlay, staggered offset) but renders
 * whatever the CMS returns. A tag filter bar appears when the items carry tags.
 * Used only when there are CMS items; otherwise the page keeps its built-in grid.
 */
export default function PortfolioGallery({ items, viewLabel, onOpen, allLabel = 'ALL' }: Props) {
  const [active, setActive] = useState<string | null>(null)

  const tags = useMemo(() => {
    const bySlug = new Map<string, string>()
    items.forEach((item) => item.tags.forEach((t) => bySlug.set(t.slug, t.label)))
    return Array.from(bySlug, ([slug, label]) => ({ slug, label }))
  }, [items])

  const filtered = active ? items.filter((item) => item.tags.some((t) => t.slug === active)) : items

  return (
    <div>
      {tags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-16" role="group" aria-label="Filter by tag">
          {[{ slug: null as string | null, label: allLabel }, ...tags].map((tag) => {
            const isActive = active === tag.slug
            return (
              <button
                key={tag.slug ?? '__all'}
                type="button"
                onClick={() => setActive(tag.slug)}
                aria-pressed={isActive}
                className={`font-mono text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${
                  isActive
                    ? 'bg-acid text-black border-acid'
                    : 'border-black/20 text-zinc-500 hover:text-black hover:border-black'
                }`}
              >
                {tag.label}
              </button>
            )
          })}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-24">
        {filtered.map((item, index) => {
          const lightboxImage: LightboxImage = {
            url: item.imageUrl,
            width: item.width ?? FALLBACK_WIDTH,
            height: item.height ?? FALLBACK_HEIGHT,
          }
          return (
        <div
          key={item.id}
          className={`group cursor-pointer relative ${index % 2 === 1 ? 'md:translate-y-12' : ''}`}
          role="button"
          tabIndex={0}
          aria-label={`${viewLabel} ${item.label}`}
          onClick={() => onOpen(lightboxImage)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onOpen(lightboxImage)
            }
          }}
        >
          {/* Corner accents */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-black/10 z-10"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-black/10 z-10"></div>

          <div className="aspect-[3/4] bg-white relative overflow-hidden grayscale contrast-125 transition-all duration-700 ease-out group-hover:scale-[1.02]">
            <Image
              src={item.thumbnailUrl ?? item.imageUrl}
              alt={item.label}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-30 transition-opacity">
              <svg className="w-full h-full p-12" viewBox="0 0 100 100">
                <path
                  d={sigilPaths[index % sigilPaths.length]}
                  fill="none"
                  stroke="black"
                  strokeWidth="0.3"
                />
              </svg>
            </div>
            <div className="absolute inset-0 bg-noise opacity-50 mix-blend-multiply"></div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]">
              <div className="bg-black text-white px-4 py-2 font-mono text-xs uppercase tracking-widest">
                {viewLabel} <span className="sigil-text ml-2">→</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-start border-t border-black pt-2 relative">
            <span className="font-display font-bold text-xl uppercase">{item.label}</span>
            <span className="font-mono text-[10px] text-black/70">
              {String(index + 1).padStart(3, '0')}
            </span>
            <span className="absolute -top-2 left-1/2 w-1 h-1 bg-black rounded-full opacity-20"></span>
          </div>
        </div>
          )
        })}
      </div>
    </div>
  )
}
