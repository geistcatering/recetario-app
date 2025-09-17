import { NextResponse, NextRequest } from 'next/server'

// Rutas protegidas
const PROTECTED = ['/admin', '/api/recipes']

// Util Edge-safe (Web Crypto)
const hex = (buf: ArrayBuffer) =>
  Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')

async function hmacSHA256(message: string, secret: string) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return hex(sig)
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  if (!PROTECTED.some(p => pathname.startsWith(p))) return NextResponse.next()

  const PIN = process.env.ADMIN_PIN || ''
  const SEC = process.env.AUTH_SECRET || ''
  if (!PIN || !SEC) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.search = '?reason=missing_env'
    return NextResponse.redirect(url)
  }

  const cookie = req.cookies.get('r_auth')?.value || ''
  const good = await hmacSHA256(PIN, SEC)

  if (cookie === good) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.search = `?redirect=${encodeURIComponent(pathname + (search || ''))}`
  return NextResponse.redirect(url)
}

export const config = { matcher: ['/admin/:path*', '/api/recipes/:path*'] }
