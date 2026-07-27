'use client'

import { useEffect, useState } from 'react'

// Umami and Glitchtip use no cookies at all — the one real cookie on this
// site comes from the embedded booking widget (a language-preference cookie
// from its own subdomain). This is a disclosure notice, not a consent gate:
// blocking the booking form behind an "accept cookies" click would cost
// bookings for a functional, non-tracking cookie the guideline itself treats
// as low-risk. See /privacy for the full breakdown.
const DISMISSED_KEY = 'cookie-notice-dismissed'

export default function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(DISMISSED_KEY)) setVisible(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="status"
      className="fixed bottom-10 inset-x-0 z-40 bg-ink text-white px-4 py-3 font-mono text-xs md:text-sm border-t border-white/10"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-3 md:gap-6">
        <p className="flex-1 text-center md:text-left opacity-90">
          This site uses cookie-free analytics. The booking form (opened on
          request) sets one functional cookie for language.{' '}
          <a href="/privacy" className="underline hover:no-underline">
            Details
          </a>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 border border-white/40 px-4 py-1.5 uppercase tracking-widest hover:bg-white hover:text-ink transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  )
}
