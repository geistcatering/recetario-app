# Recetario App (Next.js + Prisma + Tailwind)

App minimal para **cargar y buscar recetas** por nombre, categorías e ingredientes. Incluye formulario admin y detalle de receta.

## Requisitos
- Node 20+ (recomendado)
- PNPM o NPM
- (Opcional) SQLite Browser para ver la DB

## Setup (local)
```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```
Abrí http://localhost:3000

- **Buscar**: Home `/`
- **Alta de receta**: `/admin/new`
- **Detalle**: `/receta/[slug]`

## Despliegue
Para Vercel necesitás un DB remoto (Turso/Neon/Postgres). Luego ajustá `DATABASE_URL` en `.env` y corré migraciones.

## Próximo
- Editar/eliminar recetas
- Login simple (PIN)
- Subida de imágenes (Cloudinary)
- Export/Import CSV
```