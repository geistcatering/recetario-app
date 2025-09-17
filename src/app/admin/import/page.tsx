'use client'
import { useState } from 'react'

function parseCSV(csv: string) {
  const lines = csv.split(/\r?\n/).map(l=>l.trim()).filter(Boolean)
  if (!lines.length) return []
  const headers = lines[0].split(',').map(h=>h.trim())
  return lines.slice(1).map(line => {
    const cells = line.split(',').map(c=>c.trim())
    const obj: any = {}
    headers.forEach((h, i) => { obj[h] = cells[i] || '' })
    return obj
  })
}

export default function ImportPage() {
  const [text, setText] = useState('title,description,time,servings,difficulty,imageUrl,categories,ingredients\nEjemplo receta,Descripción,15,10,Fácil,https://...,Fingerfood;Pescados,salmón;palta;lima')
  const [msg, setMsg] = useState<string | null>(null)

  async function uploadJSON(objs: any[]) {
    const res = await fetch('/api/recipes/bulk', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: objs })
    })
    const j = await res.json()
    if (!res.ok) throw new Error(j.error || 'Error')
    return j
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    try {
      let items: any[] = []
      try {
        const parsed = JSON.parse(text)
        if (Array.isArray(parsed)) items = parsed
      } catch {
        const rows = parseCSV(text)
        items = rows.map((r:any) => ({
          title: r.title, description: r.description, time: Number(r.time||0), servings: Number(r.servings||1),
          difficulty: r.difficulty || 'Fácil', imageUrl: r.imageUrl,
          categories: (r.categories||'').split(/[;,]/).map((s:string)=>s.trim()).filter(Boolean),
          ingredients: (r.ingredients||'').split(/[;,]/).map((s:string)=>s.trim()).filter(Boolean)
        }))
      }
      const res = await uploadJSON(items)
      setMsg(`Importadas: ${res.count}`)
    } catch (err:any) { setMsg('Error: '+err.message) }
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="text-2xl font-semibold">Importar recetas (CSV o JSON)</h1>
      <p className="text-sm text-neutral-600">Cabeceras: <code>title,description,time,servings,difficulty,imageUrl,categories,ingredients</code>. Usá <code>;</code> o <code>,</code> para separar múltiples.</p>
      <form onSubmit={submit} className="space-y-2">
        <textarea className="input w-full h-48" value={text} onChange={e=>setText(e.target.value)} />
        <button className="btn btn-primary">Importar</button>
      </form>
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  )
}
