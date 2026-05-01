import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { client } from "@/lib/sanity";

interface TrendingArticle {
  _id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
}

const slugify = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

export const TrendingSidebar = () => {
  const [trending, setTrending] = useState<TrendingArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch(`
      *[_type == "article"] | order(publishedAt desc)[0...5]{
        _id, title, "slug": slug.current, category, author, publishedAt,
        "imageUrl": mainImage.asset->url
      }
    `)
      .then((data) => setTrending(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
      <div>
        <div className="mb-4 flex items-center justify-between border-b-2 border-foreground pb-2">
          <h3 className="font-serif text-xl font-bold">Trending</h3>
          <span className="kicker">Now</span>
        </div>
        <ol className="space-y-5">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <li key={i} className="flex gap-4 animate-pulse">
                <span className="font-serif text-3xl font-bold leading-none text-[hsl(var(--brand-red))] opacity-30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-1 gap-3">
                  <div className="h-16 w-16 shrink-0 rounded bg-muted" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 w-16 rounded bg-muted" />
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-3/4 rounded bg-muted" />
                  </div>
                </div>
              </li>
            ))
          ) : trending.length > 0 ? (
            trending.map((a, i) => (
              <li key={a._id} className="flex gap-4">
                <span className="font-serif text-3xl font-bold leading-none text-[hsl(var(--brand-red))]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-1 gap-3">
                  <Link to={`/article/${a.slug}`} className="shrink-0">
                    <img src={a.imageUrl} alt={a.title}
                      className="h-16 w-16 object-cover transition-opacity hover:opacity-80" />
                  </Link>
                  <div>
                    <Link to={`/topics/${slugify(a.category)}`}
                      className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {a.category}
                    </Link>
                    <Link to={`/article/${a.slug}`}>
                      <h4 className="mt-0.5 font-serif text-sm font-bold leading-snug text-foreground hover:text-primary transition-colors line-clamp-2">
                        {a.title}
                      </h4>
                    </Link>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {a.author} · {new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="text-sm text-muted-foreground">No articles yet.</li>
          )}
        </ol>
      </div>
    </aside>
  );
};