import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(null);
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: flip } = await supabase
    .from("flips")
    .select("quote_id, quotes(id, text, author)")
    .eq("user_id", user.id)
    .eq("flipped_on", today)
    .maybeSingle();

  if (!flip) {
    return NextResponse.json(null);
  }

  return NextResponse.json(flip.quotes);
}
