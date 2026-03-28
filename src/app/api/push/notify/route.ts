import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPushNotification } from "@/lib/push";

// Use service-level client for cron job (no user session)
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: Request) {
  // Verify this is from Vercel Cron (or allow in development)
  const authHeader = request.headers.get("authorization");
  if (
    process.env.NODE_ENV === "production" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  // Get all profiles with push subscriptions
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, push_subscription")
    .not("push_subscription", "is", null);

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ notified: 0 });
  }

  // Get users who already flipped today
  const { data: todayFlips } = await supabase
    .from("flips")
    .select("user_id")
    .eq("flipped_on", today);

  const flippedUserIds = new Set(todayFlips?.map((f) => f.user_id) ?? []);

  // Send notifications to users who haven't flipped
  let notified = 0;
  let expired = 0;

  for (const profile of profiles) {
    if (flippedUserIds.has(profile.id)) continue;

    const result = await sendPushNotification(profile.push_subscription, {
      title: "Finding My Zen",
      body: "Your daily reflection awaits.",
      url: "/",
    });

    if (result.success) {
      notified++;
    } else if (result.expired) {
      // Clear expired subscription
      await supabase
        .from("profiles")
        .update({ push_subscription: null })
        .eq("id", profile.id);
      expired++;
    }
  }

  return NextResponse.json({ notified, expired });
}
