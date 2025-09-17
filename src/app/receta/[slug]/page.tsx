import { prisma } from '@/lib/db'
import Image from 'next/image'

export default async function RecipePage({ params }: { params: { slug: string }}) {
  const recipe = await prisma.recipe.findUnique({
    where: { slug: params.slug },
    include: { categories: { include: { category: true } }, ingredients: { include: { ingredient: true } } }
  })
  if (!recipe) return <div>No encontrada</div>

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        {recipe.imageUrl && (
          <div className="aspect-video relative card">
            <Image src={recipe.imageUrl} alt={recipe.title} fill className="object-cover" />
          </div>
        )}
        <h1 className="text-2xl font-semibold">{recipe.title}</h1>
        <p className="text-neutral-700">{recipe.description}</p>
        <div className="flex gap-3 text-sm text-neutral-500">
          <span>{recipe.time} min</span>
          <span>•</span>
          <span>Rinde {recipe.servings}</span>
          <span>•</span>
          <span>{recipe.difficulty}</span>
        </div>
        <section className="card p-4">
          <h2 className="font-medium mb-2">Ingredientes</h2>
          <ul className="list-disc list-inside space-y-1">
            {recipe.ingredients.map(ir => (<li key={ir.ingredientId}>{ir.ingredient.name}</li>))}
          </ul>
        </section>
      </div>
      <aside className="space-y-4">
        <div className="card p-4">
          <a className="btn btn-primary w-full" href={`https://wa.me/5491130741440?text=${encodeURIComponent('Hola, me interesó la receta "'+recipe.title+'" para un evento.')}`} target="_blank">Consultar por WhatsApp</a>
        </div>
        <div className="card p-4">
          <h3 className="font-medium mb-2">Categorías</h3>
          <div className="flex flex-wrap gap-1">
            {recipe.categories.map(c => (<span key={c.categoryId} className="badge">{c.category.name}</span>))}
          </div>
        </div>
      </aside>
    </div>
  )
}
