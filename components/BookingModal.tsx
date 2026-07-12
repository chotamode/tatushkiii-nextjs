'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { getOpnFormUrl } from '../lib/opnform'

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// After this long without the iframe loading, suggest DM as a fallback.
const SLOW_LOAD_MS = 8000

export default function BookingModal({ open, onOpenChange }: BookingModalProps) {
  const { t } = useTranslation()
  const formUrl = getOpnFormUrl()
  const [loaded, setLoaded] = useState(false)
  const [slow, setSlow] = useState(false)

  // The component stays mounted while closed, so reset the loading state on
  // close — reopening remounts the iframe and it loads from scratch again.
  useEffect(() => {
    if (open) return
    setLoaded(false)
    setSlow(false)
  }, [open])

  useEffect(() => {
    if (!open || loaded) return
    const id = window.setTimeout(() => setSlow(true), SLOW_LOAD_MS)
    return () => window.clearTimeout(id)
  }, [open, loaded])

  // Lock body scroll while open. Escape-to-close and keyboard focus trapping
  // are handled by useFocusTrap below.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const closeModal = () => onOpenChange(false)
  const dialogRef = useFocusTrap<HTMLDivElement>(open, closeModal)

  if (!open) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.book}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 backdrop-blur-sm animate-fadeIn p-4"
      onClick={closeModal}
    >
      {/* Close Button */}
      <button
        className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors z-10 group"
        onClick={closeModal}
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
          <div className="relative">
            <iframe
              src={formUrl}
              title="Booking form"
              onLoad={() => setLoaded(true)}
              className={`w-full h-[80vh] border-0 rounded bg-white transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {!loaded && (
              <div
                role="status"
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded border border-white/20 bg-ink text-white"
              >
                <span className="sigil-text animate-spin text-4xl [animation-duration:2.5s]" aria-hidden="true">✦</span>
                <span className="font-mono text-xs uppercase tracking-[0.3em]">{t.contact.formLoading}</span>
                <span
                  className={`max-w-xs px-6 text-center font-mono text-[10px] uppercase tracking-widest text-gray-400 transition-opacity duration-500 ${slow ? 'opacity-100' : 'opacity-0'}`}
                  aria-hidden={!slow}
                >
                  {t.contact.formSlow}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white text-ink p-10 text-center font-mono text-sm uppercase tracking-widest rounded">
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
