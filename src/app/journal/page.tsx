import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { JournalTimeline } from "@/components/journal-timeline";

export default async function JournalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: flips } = await supabase
    .from("flips")
    .select("id, flipped_on, created_at, quotes(id, text, author)")
    .eq("user_id", user!.id)
    .order("flipped_on", { ascending: false });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-[480px] flex-1 px-[24px] py-[32px]">
        <h1 className="text-[24px] font-light text-text">Your Journal</h1>
        <p className="mt-[8px] text-[14px] text-text-secondary">
          A timeline of your daily reflections
        </p>
        <div className="mt-[32px]">
          <JournalTimeline flips={flips ?? []} />
        </div>
      </main>
    </div>
  );
}
