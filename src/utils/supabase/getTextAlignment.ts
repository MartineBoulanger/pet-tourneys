// =================================================
// Helper function for the CMS actions
// - to set the correct text alignment Tailwind class
// =================================================
export function getTextAlignment(alignment: string) {
  switch (alignment) {
    case 'left':
      return 'text-left';
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
}
