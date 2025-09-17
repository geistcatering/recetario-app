import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/slug'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const title = String(body.title || '').trim()
    if (!title) return NextResponse.json({ error: 'Título requerido' }, { status: 400 })
    const slug = slugify(title)

    const recipe = await prisma.recipe.create({
      data: {
        title,
        slug,
        description: String(body.description || ''),
        time: Number(body.time || 0),
        servings: Number(body.servings || 1),
        difficulty: String(body.difficulty || 'Fácil'),
        imageUrl: String(body.imageUrl || ''),
      }
    })

    // categories
    const cats = String(body.categories || '').split(',').map((s:string)=>s.trim()).filter(Boolean)
    for (const c of cats) {
      const cat = await prisma.category.upsert({ where: { name: c }, update: {}, create: { name: c, slug: slugify(c) } })
      await prisma.categoryOnRecipe.create({ data: { recipeId: recipe.id, categoryId: cat.id } })
    }

    // ingredients
    const ings = String(body.ingredients || '').split(',').map((s:string)=>s.trim()).filter(Boolean)
    for (const i of ings) {
      const ing = await prisma.ingredient.upsert({ where: { name: i }, update: {}, create: { name: i } })
      await prisma.ingredientOnRecipe.create({ data: { recipeId: recipe.id, ingredientId: ing.id } })
    }

    return NextResponse.json({ ok: true, slug: recipe.slug })
  } catch (e:any) {
    console.error(e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
