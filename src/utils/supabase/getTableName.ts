import { TableName } from '@/types/supabase.types';

// =================================================
// Helper function for the API schema tables
// - to set the correct API table name
// =================================================
export const getTableName = (table: TableName, id: string) => {
  const suffix = id.replace(/-/g, '');
  return `${table}_${suffix}`;
};
