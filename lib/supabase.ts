import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase: SupabaseClient | null =
  url && serviceKey
    ? createClient(url, serviceKey, { auth: { persistSession: false } })
    : null;

export const isSupabaseConfigured = () => supabase !== null;

/**
 * Fetch ALL rows from a table, paginating past PostgREST's hard per-request
 * max-rows cap (1000). A plain `.limit(5000)` is silently clamped to 1000 by
 * the server, so dashboards/exports must page through with `.range()`.
 * Ordered newest-first with `id` as a stable tiebreaker so pages don't overlap.
 */
export async function fetchAllRows<T = Record<string, unknown>>(
  table: string
): Promise<{ rows: T[]; error: string | null }> {
  if (!supabase) return { rows: [], error: "Supabase not configured." };
  const PAGE = 1000;
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("submitted_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, from + PAGE - 1);
    if (error) return { rows, error: error.message };
    if (!data || data.length === 0) break;
    rows.push(...(data as T[]));
    if (data.length < PAGE) break; // last page reached
  }
  return { rows, error: null };
}
