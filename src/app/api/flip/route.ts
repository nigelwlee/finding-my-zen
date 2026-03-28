import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { selectQuoteForUser } from "@/lib/quotes";

const isUnlimited = process.env.NEXT_PUBLIC_FLIP_MODE === "unlimited";

export async function POST() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = new Date().toISOString().split("T")[0];

  // Check if already flipped today (for authenticated users, once-per-day mode only)
  if (user && !isUnlimited) {
    const { data: existingFlip } = await supabase
      .from("flips")
      .select("id, quote_id")
      .eq("user_id", user.id)
      .eq("flipped_on", today)
      .maybeSingle();

    if (existingFlip) {
      // Return the existing quote
      const { data: quote } = await supabase
        .from("quotes")
        .select("id, text, author")
        .eq("id", existingFlip.quote_id)
        .single();

      return NextResponse.json(quote);
    }
  }

  // Select a quote
  const quote = await selectQuoteForUser(supabase, user?.id ?? null);

  // Record the flip (for authenticated users, once-per-day mode only)
  if (user && !isUnlimited) {
    await supabase.from("flips").insert({
      user_id: user.id,
      quote_id: quote.id,
      flipped_on: today,
    });
  }

  return NextResponse.json(quote);
}
