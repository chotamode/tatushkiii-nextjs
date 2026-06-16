'use client'

import { useEffect } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { getOpnFormUrl } from '../lib/opnform'

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BookingModal({ open, onOpenChange }: BookingModalProps) {
  const { t } = useTranslation()
  const formUrl = getOpnFormUrl()

  // Close on Escape and lock body scroll while open
  useEffect(() => {
    if (!open) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', handleKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fadeIn p-4"
      onClick={() => onOpenChange(false)}
    >
      {/* Close Button */}
      <button
        className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors z-10 group"
        onClick={() => onOpenChange(false)}
      >
        <div className="relative">
          <span className="text-5xl font-thin leading-none block group-hover:rotate-90 transition-transform duration-300">×</span>
          <span className="absolute -bottom-6 right-0 font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            {t.portfolio.close}
          </span>
        </div>
      </button>

      {/* Form Container */}
      <div
        className="relative w-full max-w-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {formUrl ? (
          <iframe
            src={formUrl}
            title="Booking form"
            className="w-full h-[80vh] border-0 rounded bg-white"
          />
        ) : (
          <div className="bg-white text-black p-10 text-center font-mono text-sm uppercase tracking-widest rounded">
            {t.contact.formUnavailable}
          </div>
        )}

        {/* Decorative corners */}
        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-white/30 pointer-events-none"></div>
        <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-white/30 pointer-events-none"></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-white/30 pointer-events-none"></div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-white/30 pointer-events-none"></div>
      </div>
    </div>
  )
}
