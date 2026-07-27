import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">
          404
        </p>
        <h1 className="font-display text-3xl md:text-4xl mb-4">
          Page not found
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest">
          <Link
            href="/"
            className="border border-ink px-6 py-3 hover:bg-ink hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/#portfolio"
            className="border border-ink px-6 py-3 hover:bg-ink hover:text-white transition-colors"
          >
            Portfolio
          </Link>
        </div>
      </div>
    </main>
  )
}
