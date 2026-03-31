// helper function to capitalize words
export function capitalizeWord(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
