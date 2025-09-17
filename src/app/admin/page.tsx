import Link from 'next/link'
import { prisma } from '@/lib/db'

export default async function AdminHome() {
  const recipes = await prisma.recipe.findMany({ orderBy: { updatedAt: 'desc' } })
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <div className="flex gap-2">
          <Link className="btn" href="/admin/new">Nueva</Link>
          <Link className="btn" href="/admin/import">Importar</Link>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-2 border-b">Título</th>
            <th className="text-left p-2 border-b">Tiempo</th>
            <th className="text-left p-2 border-b">Rinde</th>
            <th className="text-left p-2 border-b">Dificultad</th>
            <th className="p-2 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((r:any) => (
            <tr key={r.id}>
              <td className="p-2 border-b">{r.title}</td>
              <td className="p-2 border-b">{r.time} min</td>
              <td className="p-2 border-b">{r.servings}</td>
              <td className="p-2 border-b">{r.difficulty}</td>
              <td className="p-2 border-b text-right">
                <Link className="btn" href={`/receta/${r.slug}`}>Ver</Link>{' '}
                <Link className="btn" href={`/admin/edit/${r.id}`}>Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
