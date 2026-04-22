import { articles } from "@/data/articles";
import { ArticleCard } from "./ArticleCard";

export const TrendingSidebar = () => {
  const trending = articles.slice(0, 5);
  return (
    <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
      <div>
        <div className="mb-4 flex items-center justify-between border-b-2 border-foreground pb-2">
          <h3 className="font-serif text-xl font-bold">Trending</h3>
          <span className="kicker">Now</span>
        </div>
        <ol className="space-y-5">
          {trending.map((a, i) => (
            <li key={a.slug} className="flex gap-4">
              <span className="font-serif text-3xl font-bold leading-none text-[hsl(var(--brand-red))]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <ArticleCard article={a} variant="horizontal" />
            </li>
          ))}
        </ol>
      </div>

      <div className="border border-border bg-secondary p-6">
        <p className="kicker-blue">Newsletter</p>
        <h4 className="mt-2 font-serif text-lg font-bold">Sunday Brief</h4>
        <p className="mt-2 text-sm text-muted-foreground">A weekly digest from our editors.</p>
        <a href="#newsletter" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">Subscribe →</a>
      </div>
    </aside>
  );
};
