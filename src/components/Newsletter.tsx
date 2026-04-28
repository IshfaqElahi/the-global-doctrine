import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  return (
    <section className="border-y border-border bg-foreground text-background">
      <div className="container-editorial grid items-center gap-8 py-16 md:grid-cols-2">
        <div>
          <p className="text-base font-bold uppercase tracking-[0.2em] text-[hsl(var(--brand-red))]">The Doctrine Brief</p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl">
            The week in geopolitics, delivered every Sunday.
          </h2>
          <p className="mt-3 max-w-md text-sm text-background/70">
            One careful email. No noise. Trusted by diplomats, scholars, and the curious.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Almost there — check your inbox to confirm.");
            setEmail("");
          }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="flex-1 border border-background/30 bg-transparent px-4 py-3 text-sm text-background placeholder:text-background/50 outline-none focus:border-background"
          />
          <Button type="submit" variant="default" className="bg-[hsl(var(--brand-red))] text-brand-red-foreground hover:bg-[hsl(var(--brand-red))]/90">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};
