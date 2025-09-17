'use client'
import { useState } from 'react'

export default function NewRecipePage() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setMsg(null)
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Error')
      setMsg('Receta creada ✅')
      form.reset()
    } catch (err:any) {
      setMsg('Error: '+err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Nueva receta</h1>
      <form onSubmit={submit} className="space-y-3">
        <input name="title" className="input w-full" placeholder="Título" required />
        <textarea name="description" className="input w-full h-24" placeholder="Descripción" />
        <div className="grid grid-cols-3 gap-2">
          <input name="time" type="number" className="input" placeholder="Minutos" defaultValue={0} />
          <input name="servings" type="number" className="input" placeholder="Rinde" defaultValue={1} />
          <select name="difficulty" className="input">
            <option>Fácil</option><option>Media</option><option>Difícil</option>
          </select>
        </div>
        <input name="imageUrl" className="input w-full" placeholder="URL de imagen (opcional)" />
        <input name="categories" className="input w-full" placeholder="Categorías separadas por coma" />
        <input name="ingredients" className="input w-full" placeholder="Ingredientes separados por coma" />
        <button className="btn btn-primary" disabled={loading}>{loading?'Guardando…':'Guardar'}</button>
      </form>
      {msg && <p className="text-sm">{msg}</p>}
      <p className="text-xs text-neutral-500">Tip: Podés pegar varias categorías/ingredientes separados por coma. Ej: "Fingerfood, Pescados" / "salmón, palta, lima".</p>
    </div>
  )
}
