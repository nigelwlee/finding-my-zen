import { SupabaseClient } from "@supabase/supabase-js";

export async function selectQuoteForUser(
  supabase: SupabaseClient,
  userId: string | null
): Promise<{ id: number; text: string; author: string }> {
  if (userId) {
    // Get IDs of quotes the user has already seen
    const { data: seenFlips } = await supabase
      .from("flips")
      .select("quote_id")
      .eq("user_id", userId);

    const seenIds = seenFlips?.map((f) => f.quote_id) ?? [];

    // Try to pick an unseen quote
    let query = supabase.from("quotes").select("id, text, author");

    if (seenIds.length > 0) {
      // If all quotes have been seen, exclude only the last 30
      const { count } = await supabase
        .from("quotes")
        .select("id", { count: "exact", head: true });

      if (count && seenIds.length >= count) {
        const recentIds = seenIds.slice(-30);
        query = query.not("id", "in", `(${recentIds.join(",")})`);
      } else {
        query = query.not("id", "in", `(${seenIds.join(",")})`);
      }
    }

    const { data, error } = await query.limit(1).order("id").maybeSingle();

    // Fallback to any random quote if the filtered query failed
    if (error || !data) {
      const { data: fallback } = await supabase
        .from("quotes")
        .select("id, text, author")
        .limit(1)
        .single();
      return fallback!;
    }

    return data;
  }

  // Anonymous: deterministic quote based on date
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase.rpc("quote_for_date", { target_date: today });

  if (data && Array.isArray(data) && data.length > 0) return data[0];
  if (data && !Array.isArray(data)) return data;

  // Fallback
  const { data: fallback } = await supabase
    .from("quotes")
    .select("id, text, author")
    .limit(1)
    .single();
  return fallback!;
}
