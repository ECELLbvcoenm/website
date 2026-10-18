export function memberImagePath(name: unknown): string | null {
  if (typeof name !== "string") return null;
  const slug = name.trim().toLowerCase().replace(/\s+/g, "_");
  return /^[a-z0-9_-]+$/.test(slug) ? `/images/members/${slug}.jpg` : null;
}
