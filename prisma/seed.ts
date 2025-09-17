import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const data = [
  {
    title: 'Tartar de salmón y palta',
    slug: 'tartar-de-salmon-y-palta',
    description: 'Cucharitas frías con tartar de salmón, palta y cítricos.',
    time: 20,
    servings: 6,
    difficulty: 'Media',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
    categories: ['Fingerfood','Pescados','Gourmet'],
    ingredients: ['salmón','palta','lima','cebolla morada','sésamo','aceite de oliva']
  },
  {
    title: 'Babaganoush ahumado',
    slug: 'babaganoush-ahumado',
    description: 'Crema de berenjenas asadas con tahini y limón.',
    time: 35, servings: 8, difficulty: 'Fácil',
    imageUrl: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop',
    categories: ['Vegano','Dips','Medio Oriente'],
    ingredients: ['berenjena','tahini','limón','ajo','comino','pimentón ahumado']
  },
  {
    title: 'Gel de espárragos',
    slug: 'gel-de-esparragos',
    description: 'Gel para decoración y montajes modernos.',
    time: 30, servings: 30, difficulty: 'Media',
    imageUrl: 'https://images.unsplash.com/photo-1526312426976-593c2c7966a0?q=80&w=1200&auto=format&fit=crop',
    categories: ['Técnicas','Vegetales','Gourmet'],
    ingredients: ['espárragos','agar agar','sal','aceite de oliva','agua']
  }
]

async function main() {
  for (const r of data) {
    const recipe = await prisma.recipe.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        title: r.title, slug: r.slug, description: r.description,
        time: r.time, servings: r.servings, difficulty: r.difficulty, imageUrl: r.imageUrl,
      }
    })
    for (const c of r.categories) {
      const cat = await prisma.category.upsert({
        where: { name: c },
        update: {},
        create: { name: c, slug: c.toLowerCase().replace(/\s+/g,'-') }
      })
      await prisma.categoryOnRecipe.upsert({
        where: { recipeId_categoryId: { recipeId: recipe.id, categoryId: cat.id } },
        update: {},
        create: { recipeId: recipe.id, categoryId: cat.id }
      })
    }
    for (const i of r.ingredients) {
      const ing = await prisma.ingredient.upsert({
        where: { name: i },
        update: {},
        create: { name: i }
      })
      await prisma.ingredientOnRecipe.upsert({
        where: { recipeId_ingredientId: { recipeId: recipe.id, ingredientId: ing.id } },
        update: {},
        create: { recipeId: recipe.id, ingredientId: ing.id }
      })
    }
  }
  console.log('Seed OK')
}
main().finally(()=>prisma.$disconnect())
