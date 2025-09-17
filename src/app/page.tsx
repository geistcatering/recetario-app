import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/db'

async function getRecipes(search: string, ing: string, cats: string[], maxTime?: number, difficulty?: string) {
  const recipes = await prisma.recipe.findMany({
    include: { categories: { include: { category: true } }, ingredients: { include: { ingredient: true } } }
  })
  const q = search?.toLowerCase() || ''
  const ingTokens = ing?.toLowerCase().split(',').map(t=>t.trim()).filter(Boolean) || []
  const catSet = new Set(cats || [])

  const filtered = recipes.filter(r => {
    const nameOk = !q || r.title.toLowerCase().includes(q)
    const catsOk = catSet.size===0 || Array.from(catSet).every(c => r.categories.some(cr=>cr.category.name===c))
    const ingOk = ingTokens.length===0 || ingTokens.every(tok => r.ingredients.some(ir => ir.ingredient.name.toLowerCase().includes(tok)))
    const timeOk = !maxTime || r.time <= maxTime
    const diffOk = !difficulty || difficulty==='Todas' || r.difficulty===difficulty
    return nameOk && catsOk && ingOk && timeOk && diffOk
  })
  return filtered
}

export default async function Home({ searchParams }: { searchParams: any }) {
  const recipes = await getRecipes(
    searchParams.q || '',
    searchParams.ing || '',
    Array.isArray(searchParams.cat) ? searchParams.cat : (searchParams.cat ? [searchParams.cat] : []),
    searchParams.time ? Number(searchParams.time) : undefined,
    searchParams.diff || 'Todas'
  )

  const allCats = await prisma.category.findMany({ orderBy: { name: 'asc' }})

  return (
    <div className="space-y-4">
      <form className="grid gap-2 md:grid-cols-4" action="/">
        <input className="input" name="q" placeholder="Buscar por nombre…" defaultValue={searchParams.q||''} />
        <input className="input md:col-span-2" name="ing" placeholder="Ingredientes (ajo, limón)" defaultValue={searchParams.ing||''} />
        <select className="input" name="sort" defaultValue={searchParams.sort||'relevance'}>
          <option value="relevance">Orden: Relevancia</option>
          <option value="time">Orden: Tiempo (asc)</option>
          <option value="alpha">Orden: Alfabético</option>
        </select>
        <div className="md:col-span-3 flex flex-wrap gap-2 items-center">
          {allCats.map(c=>{
            const checked = (Array.isArray(searchParams.cat) ? searchParams.cat : [searchParams.cat]).includes(c.name)
            return (
              <label key={c.id} className={`badge cursor-pointer ${checked ? 'bg-black text-white' : ''}`}>
                <input type="checkbox" name="cat" value={c.name} defaultChecked={checked} className="hidden" />
                <span className="px-1 py-0.5">{c.name}</span>
              </label>
            )
          })}
        </div>
        <div className="flex gap-2">
          <select className="input" name="time" defaultValue={searchParams.time||'0'}>
            <option value="0">Sin límite</option>
            <option value="10">≤ 10 min</option>
            <option value="20">≤ 20 min</option>
            <option value="30">≤ 30 min</option>
            <option value="45">≤ 45 min</option>
            <option value="60">≤ 60 min</option>
          </select>
          <select className="input" name="diff" defaultValue={searchParams.diff||'Todas'}>
            <option>Todas</option>
            <option>Fácil</option>
            <option>Media</option>
            <option>Difícil</option>
          </select>
          <button className="btn btn-primary" type="submit">Filtrar</button>
        </div>
      </form>

      <p className="text-sm text-neutral-500">{recipes.length} resultado(s)</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map(r => (
          <article key={r.id} className="card hover:shadow-lg transition">
            {r.imageUrl && (
              <div className="aspect-video relative">
                <Image src={r.imageUrl} alt={r.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold">{r.title}</h3>
                <div className="text-right text-xs text-neutral-500">
                  <p>{r.time} min · {r.difficulty}</p>
                  <p>Rinde {r.servings}</p>
                </div>
              </div>
              <p className="text-sm text-neutral-700 line-clamp-2">{r.description}</p>
              <div className="flex flex-wrap gap-1">
                {r.categories.map(c => <span key={c.categoryId} className="badge">{c.category.name}</span>)}
              </div>
              <div className="flex gap-2 pt-1">
                <a className="btn btn-primary flex-1 text-center" href={`https://wa.me/5491130741440?text=${encodeURIComponent('Hola, me interesó la receta "'+r.title+'" para un evento. ¿Podemos adaptarla?')}`} target="_blank">WhatsApp</a>
                <Link className="btn" href={`/receta/${r.slug}`}>Abrir</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
