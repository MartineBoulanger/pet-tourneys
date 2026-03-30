// =================================================
// Helper function for the CMS schema tables
// - to set the correct label for the page types
// =================================================
export const getPageTypeLabel = (type: string): string => {
  switch (type) {
    case 'articles':
      return 'Article';
    case 'guides':
      return 'Guide';
    case 'pet-reviews':
      return 'Pet Review';
    default:
      return type;
  }
};
