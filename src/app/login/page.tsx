'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Evita prerender estático en /login (SSR en runtime)
export const dynamic = 'force-dynamic'

function LoginInner() {
  const router = useRouter()
  const params = useSearchParams()
  const [pin, setPin] = useState('')
  const [err, setErr] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      })
      if (!res.ok) throw new Error('PIN incorrecto')
      const go = params.get('redirect') || '/admin'
      router.push(go)
    } catch (e:any) {
      setErr(e.message || 'Error')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white/70 p-6 rounded-xl border">
      <h2 className="text-xl font-semibold mb-4">Acceso</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="password"
          value={pin}
          onChange={e=>setPin(e.target.value)}
          className="input w-full"
          placeholder="PIN"
        />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn btn-primary w-full">Entrar</button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  // Suspense requerido cuando se usa useSearchParams
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  )
}
