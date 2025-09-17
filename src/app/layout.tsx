import './globals.css'
import Link from 'next/link'
import Script from 'next/script'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#111827" />
      </head>
      <body>
        {/* Cloudinary (opcional) */}
        <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="afterInteractive" />
        {/* Registrar Service Worker para PWA */}
        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(console.error);
            });
          }
        `}</Script>

        <header className="sticky top-0 z-10 backdrop-blur border-b bg-white/70">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">Recetario</Link>
            <nav className="flex gap-2">
              <Link className="btn" href="/">Buscar</Link>
              <Link className="btn" href="/admin">Admin</Link>
              <Link className="btn" href="/admin/new">Nueva</Link>
              <Link className="btn" href="/admin/import">Importar</Link>
            </nav>
          </div>
        </header>

        <main className="container py-6">{children}</main>

        <footer className="border-t bg-white/70">
          <div className="container py-6 text-xs text-neutral-500 flex items-center justify-between">
            <span>© {new Date().getFullYear()} Recetario</span>
            <span>Hecho con ❤️ y buen gusto</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
