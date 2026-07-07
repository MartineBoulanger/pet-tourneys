// =================================================
// helper function to fetch all rows from a Supabase table using pagination
// - this is for when there are more than 1000 rows in the table
// =================================================
export async function fetchAllTableRows<T>(
  queryFn: (
    from: number,
    to: number,
  ) => Promise<{ data: T[] | null; error: { message: string } | null }>,
  pageSize = 1000,
): Promise<T[]> {
  let allRows: T[] = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await queryFn(from, from + pageSize - 1);
    if (error) throw new Error(error.message);

    const rows = data ?? [];
    allRows = [...allRows, ...rows];
    hasMore = rows.length === pageSize;
    from += pageSize;
  }

  return allRows;
}
