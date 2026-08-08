export function slugify(value: string) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function createUniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
) {
  const baseSlug = slugify(base || 'portfolio');
  let slug = baseSlug || 'portfolio';
  let count = 0;

  while (await exists(slug)) {
    count += 1;
    slug = `${baseSlug}-${count}`;
  }

  return slug;
}
