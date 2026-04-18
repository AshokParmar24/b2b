export default function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // spaces → hyphens
    .replace(/[^\w\-]+/g, "")    // remove non-word chars
    .replace(/\-\-+/g, "-")      // collapse multiple hyphens
    .replace(/^-+/, "")          // trim leading hyphens
    .replace(/-+$/, "");          // trim trailing hyphens
}
