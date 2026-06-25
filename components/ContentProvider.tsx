'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Locale, SiteContent } from '@/lib/payload'

interface ContentContextValue {
  content: SiteContent
  locale: Locale
  changeLocale: (locale: Locale) => void
}

const ContentContext = createContext<ContentContextValue | null>(null)

const SUPPORTED: Locale[] = ['en', 'cs', 'ru']

/**
 * Holds the content fetched from Payload (passed from the server component)
 * plus the active locale (persisted in localStorage, mirroring the previous
 * useTranslation behaviour). Wraps the whole page.
 */
export function ContentProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved && SUPPORTED.includes(saved)) setLocale(saved)
  }, [])

  const changeLocale = (next: Locale) => {
    setLocale(next)
    localStorage.setItem('locale', next)
  }

  return <ContentContext.Provider value={{ content, locale, changeLocale }}>{children}</ContentContext.Provider>
}

export function useContentContext(): ContentContextValue {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContentContext must be used within a <ContentProvider>')
  return ctx
}

/**
 * Dynamic content (portfolio / faqs / testimonials / services / settings)
 * resolved to the current locale, ready to render.
 */
export function useContent() {
  const { content, locale } = useContentContext()
  const pick = (value: Record<Locale, string>) => value[locale]

  return {
    locale,
    portfolio: content.portfolio.map((p) => ({ ...p, label: pick(p.label) })),
    faqs: content.faqs.map((f) => ({ ...f, question: pick(f.question), answer: pick(f.answer) })),
    testimonials: content.testimonials.map((t) => ({ ...t, text: pick(t.text), work: pick(t.work) })),
    services: content.services.map((s) => ({ ...s, name: pick(s.name), description: pick(s.description) })),
    settings: content.settings,
  }
}
