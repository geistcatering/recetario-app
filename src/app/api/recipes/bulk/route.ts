import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/slug'

export async function POST(req: Request) {
  try {
    const body = await req.json() as any
    const items = Array.isArray(body.items) ? body.items : []
    let count = 0

    for (const r of items) {
      if (!r?.title) continue

      const title = String(r.title).trim()
      const slug = slugify(title)

      // Crea o ACTUALIZA por slug (evita duplicados si ya existe)
      const recipe = await prisma.recipe.upsert({
        where: { slug },
        update: {
          title,
          description: String(r.description || ''),
          time: Number(r.time || 0),
          servings: Number(r.servings || 1),
          difficulty: String(r.difficulty || 'Fácil'),
          imageUrl: String(r.imageUrl || '')
        },
        create: {
          title,
          slug,
          description: String(r.description || ''),
          time: Number(r.time || 0),
          servings: Number(r.servings || 1),
          difficulty: String(r.difficulty || 'Fácil'),
          imageUrl: String(r.imageUrl || '')
        }
      })

      // Limpio relaciones para rearmarlas sin duplicados
      await prisma.categoryOnRecipe.deleteMany({ where: { recipeId: recipe.id } })
      await prisma.ingredientOnRecipe.deleteMany({ where: { recipeId: recipe.id } })

      // Categorías: upsert por slug (evita colisiones por mayúsculas/acentos)
      const cats: string[] = (r.categories || []).map((c: string) => String(c).trim()).filter(Boolean)
      for (const c of cats) {
        const cSlug = slugify(c)
        const cat = await prisma.category.upsert({
          where: { slug: cSlug },
          update: { name: c },
          create: { name: c, slug: cSlug }
        })
        await prisma.categoryOnRecipe.create({ data: { recipeId: recipe.id, categoryId: cat.id } })
      }

      // Ingredientes: upsert por nombre normalizado
      const ings: string[] = (r.ingredients || []).map((i: string) => String(i).trim()).filter(Boolean)
      for (const i of ings) {
        const norm = i // si querés, podés hacer .toLowerCase()
        const ing = await prisma.ingredient.upsert({
          where: { name: norm },
          update: {},
          create: { name: norm }
        })
        await prisma.ingredientOnRecipe.create({ data: { recipeId: recipe.id, ingredientId: ing.id } })
      }

      count++
    }

    return NextResponse.json({ ok: true, count })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || 'Error en import' }, { status: 500 })
  }
}

