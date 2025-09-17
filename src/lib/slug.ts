export function slugify(s: string) {
  return s
    .normalize('NFD').replace(/\p{Diacritic}/gu,'')
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g,'')
    .replace(/\s+/g,'-')
    .replace(/-+/g,'-')
}
