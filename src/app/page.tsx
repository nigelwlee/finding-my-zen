import { Coin } from "@/components/coin";
import { Header } from "@/components/header";
import { NotificationPrompt } from "@/components/notification-prompt";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-[16px]">
        <Coin isAuthenticated={!!user} />
      </main>
      {user && <NotificationPrompt />}
    </div>
  );
}
