import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
        <div className="mb-5 flex items-center justify-between border-b-2 border-foreground pb-2">
          <h3 className="font-serif text-xl font-bold">Trending</h3>
          <span className="kicker">Now</span>
        </div>
        <ol className="space-y-5">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-serif text-3xl font-bold leading-none text-[hsl(var(--brand-red))] opacity-20">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-1 gap-3">
                  <div className="skeleton h-16 w-16 shrink-0 rounded-none" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="skeleton h-3 w-16" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-3/4" />
                  </div>
                </div>
              </li>
            ))
          ) : trending.length > 0 ? (
            trending.map((a, i) => (
              <motion.li
                key={a._id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                className="flex gap-4 group"
              >
                <span className="font-serif text-3xl font-bold leading-none text-[hsl(var(--brand-red))] transition-transform duration-200 group-hover:scale-110">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-1 gap-3">
                  <Link to={`/article/${a.slug}`} className="shrink-0 img-zoom">
                    <img src={a.imageUrl} alt={a.title}
                      className="h-16 w-16 object-cover" />
                  </Link>
                  <div>
                    <Link to={`/topics/${slugify(a.category)}`}
                      className="text-[10px] font-bold uppercase tracking-wider text-primary transition-colors hover:text-[hsl(var(--brand-red))]">
                      {a.category}
                    </Link>
                    <Link to={`/article/${a.slug}`}>
                      <h4 className="mt-0.5 font-serif text-sm font-bold leading-snug text-foreground hover:text-primary transition-colors duration-200 line-clamp-2">
                        {a.title}
                      </h4>
                    </Link>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {a.author} · {new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))
          ) : (
            <li className="text-sm text-muted-foreground italic">No articles yet.</li>
          )}
        </ol>
      </div>
    </aside>
  );
};