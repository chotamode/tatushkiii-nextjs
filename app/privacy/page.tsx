import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How doomp.ink collects, stores, and protects your data.',
  robots: { index: false, follow: true },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="container mx-auto max-w-2xl px-4 py-16 md:py-24">
        <a href="/" className="font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-ink transition-colors">
          ← doomp.ink
        </a>

        <h1 className="font-display text-3xl md:text-4xl mt-8 mb-2">Privacy Policy</h1>
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-12">
          Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-10 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl mb-3">What this site collects, and why</h2>
            <p className="mb-3">
              doomp.ink is a small business site. It doesn&apos;t sell ads, doesn&apos;t
              share data with data brokers, and every tool it uses is self-hosted on
              infrastructure we control — nothing here is handed off to a third-party
              advertising or analytics company.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Analytics (Umami).</strong> Self-hosted, does not use cookies
                and does not store anything in your browser. It counts visits and
                page views using a one-way daily hash of your IP address and browser
                — the site never sees or stores your raw IP, and no individual visitor
                can be identified or tracked across visits or across other websites.
              </li>
              <li>
                <strong>Error monitoring (Glitchtip).</strong> Self-hosted, Sentry-
                compatible. If something breaks while you&apos;re using the site, a
                technical error report (what broke, which page, browser type) is sent
                to help us fix it. Your IP address is processed briefly as part of
                that report and is not used for tracking or profiling.
              </li>
              <li>
                <strong>Booking form.</strong> When you submit the booking form, the
                name and contact details you provide (Telegram, email, or phone — your
                choice) are used only to get back to you about your tattoo request.
                They are not used for marketing and are not shared with anyone outside
                of running the studio.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl mb-3">Cookies</h2>
            <p className="mb-3">
              This site does not use cookies for analytics or advertising — Umami and
              Glitchtip, described above, work without any cookie or browser storage.
            </p>
            <p>
              The booking form is provided through an embedded booking widget hosted
              on our own infrastructure. That widget sets <strong>one functional
              cookie</strong> to remember your language preference inside the form —
              it is not used to track you, is not shared with any third party, and
              only appears if you open the booking form.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-3">Where your data lives</h2>
            <p>
              Everything above runs on our own servers — booking requests, error
              reports, and analytics data are not passed through Google, Meta, or any
              other third-party platform. Booking request details are kept only as
              long as needed to respond to and complete your request, and are deleted
              on request (see below).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-3">Your rights</h2>
            <p>
              You can ask what data we hold about you, ask us to correct or delete it,
              or ask us to stop processing it, at any time — email{' '}
              <a href="mailto:doompynooo@gmail.com" className="underline hover:no-underline">
                doompynooo@gmail.com
              </a>{' '}
              and we&apos;ll handle it directly, no forms or ticket systems.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
