// Deferred to after `load` so the ~120KB Sentry browser SDK is a separate,
// lazily-fetched chunk instead of part of the initial/First Load JS bundle —
// it was the single largest chunk on the page, larger than react-dom.
// Trade-off: errors before `load` fires aren't captured client-side (server
// errors still are, via instrumentation.ts, unaffected by this file).
if (typeof window !== 'undefined') {
  const init = () => {
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        tracesSampleRate: 0.1,
      })
    })
  }
  if (document.readyState === 'complete') {
    init()
  } else {
    window.addEventListener('load', init)
  }
}
