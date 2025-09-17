'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function LoginPage() {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const sp = useSearchParams()
  const router = useRouter()
  const next = sp.get('redirect') || '/admin'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    const res = await fetch('/api/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    })
    if (res.ok) router.push(next)
    else setErr('PIN incorrecto')
  }

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 rounded-2xl border bg-white/60 backdrop-blur">
      <h1 className="text-xl font-semibold mb-3">Acceso</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="input w-full" type="password" inputMode="numeric"
               placeholder="Ingresá tu PIN" value={pin} onChange={e=>setPin(e.target.value)} />
        <button className="btn btn-primary w-full">Entrar</button>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </form>
    </div>
  )
}
