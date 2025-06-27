import TokenHero from "@/modules/token/token-hero";
import TokenList from "@/modules/token/token-list";

export default function Home() {
  return (
    <section className="container mx-auto px-6 py-20">
      <TokenHero showStats={false} />
      <TokenList />
    </section>
  );
}
