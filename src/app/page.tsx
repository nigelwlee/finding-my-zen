import { Coin } from "@/components/coin";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-[16px]">
        <Coin />
      </main>
    </div>
  );
}
