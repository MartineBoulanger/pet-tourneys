// =================================================
// Helper function for the CMS schema tables
// - to set the page slug for each page created
// =================================================
export function generatePageSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
