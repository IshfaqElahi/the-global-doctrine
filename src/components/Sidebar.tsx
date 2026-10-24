import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { client } from "@/lib/sanity";
import { EditorialImage } from "@/components/EditorialImage";
import heroImg from "@/assets/hero-summit.webp";

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
    client
      .fetch(`
        *[_type in ["article", "coverStory"]] | order(publishedAt desc)[0...5]{
          _id, title, "slug": slug.current, "category": coalesce(category, "Cover Story"), author, publishedAt,
          "imageUrl": mainImage.asset->url
        }
      `)
      .then((data) => setTrending(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
      <div className="border border-border bg-card p-6 shadow-xs" style={{ borderTop: "3px solid hsl(var(--brand-red))" }}>
        <div className="mb-6 flex items-center justify-between border-b border-border pb-3">
          <div>
            <span className="kicker text-[10px]">Most Read</span>
            <h3 className="font-serif text-xl font-bold mt-0.5">Trending Dispatches</h3>
          </div>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--brand-red))] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(var(--brand-red))]" />
          </span>
        </div>

        <ol className="divide-y divide-border/60">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <li key={i} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <span className="font-serif text-2xl font-bold leading-none text-[hsl(var(--brand-red))] opacity-20">
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
                className="flex gap-3.5 py-4 first:pt-0 last:pb-0 group"
              >
                <span className="font-serif text-2xl font-bold leading-none text-[hsl(var(--brand-red))] transition-transform duration-200 group-hover:scale-110 w-7 shrink-0 pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-1 gap-3 min-w-0">
                  <Link to={`/article/${a.slug}`} className="shrink-0 w-16 h-16 overflow-hidden">
                    <EditorialImage
                      src={a.imageUrl || heroImg}
                      alt={a.title}
                      aspectClassName="aspect-square h-16 w-16"
                      width={200}
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/topics/${slugify(a.category)}`}
                      className="text-[10px] font-bold uppercase tracking-wider text-primary transition-colors hover:text-[hsl(var(--brand-red))]"
                    >
                      {a.category}
                    </Link>
                    <Link to={`/article/${a.slug}`}>
                      <h4 className="mt-0.5 font-serif text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                        {a.title}
                      </h4>
                    </Link>
                    <p className="mt-1 text-[11px] text-muted-foreground truncate">
                      {a.author} ·{" "}
                      {new Date(a.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))
          ) : (
            <li className="py-4 text-sm text-muted-foreground italic">No articles yet.</li>
          )}
        </ol>

        <div className="mt-5 pt-4 border-t border-border">
          <Link
            to="/all-articles"
            className="inline-flex items-center justify-between w-full text-xs font-bold uppercase tracking-widest text-primary hover:text-[hsl(var(--brand-red))] transition-colors"
          >
            <span>Explore Full Archive</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
