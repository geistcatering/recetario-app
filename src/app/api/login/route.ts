import { NextResponse } from 'next/server'
import crypto from 'crypto'

const sign = (pin:string, secret:string) =>
  crypto.createHmac('sha256', secret).update(pin).digest('hex')

export async function POST(req: Request) {
  const { pin } = await req.json().catch(()=>({pin:''}))
  const ADMIN_PIN = process.env.ADMIN_PIN || ''
  const AUTH_SECRET = process.env.AUTH_SECRET || ''
  if (!ADMIN_PIN || !AUTH_SECRET)
    return NextResponse.json({ error:'Faltan envs' }, { status:500 })

  if (String(pin) !== ADMIN_PIN)
    return NextResponse.json({ ok:false }, { status:401 })

  const cookieVal = sign(ADMIN_PIN, AUTH_SECRET)
  const isProd = process.env.NODE_ENV === 'production'
  const secure = isProd ? ' Secure;' : '' // en localhost NO
  const res = NextResponse.json({ ok:true })
  res.headers.append('Set-Cookie',
    `r_auth=${cookieVal}; Path=/; HttpOnly; SameSite=Lax;${secure} Max-Age=2592000`)
  return res
}
