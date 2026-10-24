import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SkeletonCardCompact } from "@/components/SkeletonCard";
import { EditorialImage } from "@/components/EditorialImage";
import { client } from "@/lib/sanity";
import heroImg from "@/assets/hero-summit.webp";

interface SanityArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
}

const slugify = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const AllArticles = () => {
  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    client
      .fetch(`
      *[_type in ["article", "coverStory"]] | order(publishedAt desc){
        _id, title, "slug": slug.current, excerpt, 
        "category": coalesce(category, "Cover Story"),
        author, publishedAt, "imageUrl": mainImage.asset->url
      }
    `)
      .then((data) => setArticles(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const availableCategories = useMemo(() => {
    const counts = new Map<string, number>();
    articles.forEach((a) => {
      counts.set(a.category, (counts.get(a.category) || 0) + 1);
    });
    return ["All", ...Array.from(counts.keys())];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

  return (
    <Layout>
      <Helmet>
        <title>All Articles — The Global Doctrine</title>
        <meta name="description" content="Complete archive of geopolitical analysis, cover stories, and regional reporting from The Global Doctrine." />
      </Helmet>

      <section className="border-b border-border bg-secondary editorial-grid-bg">
        <div className="container-editorial py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="kicker inline-flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[hsl(var(--brand-red))]" />
              Complete Archive
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl lg:text-6xl text-foreground">
              All Articles
            </h1>
            {!loading && (
              <p className="mt-4 text-base text-muted-foreground sm:text-lg border-l-2 border-primary pl-4">
                {filteredArticles.length} {filteredArticles.length === 1 ? "dispatch" : "dispatches"} in{" "}
                <span className="font-semibold text-foreground">{activeCategory}</span>
              </p>
            )}
          </motion.div>

          {/* Category Filter Bar */}
          {!loading && availableCategories.length > 1 && (
            <div className="mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {availableCategories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all duration-200 shrink-0 ${
                      isActive
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="container-editorial py-16">
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <SkeletonCardCompact key={i} />
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            >
              {filteredArticles.map((a) => (
                <motion.article
                  key={a._id}
                  variants={fadeUpItem}
                  className="group editorial-card flex flex-col overflow-hidden"
                  style={{ borderLeft: "3px solid hsl(var(--brand-red))" }}
                >
                  <Link to={`/article/${a.slug}`} className="block overflow-hidden bg-muted">
                    <EditorialImage
                      src={a.imageUrl || heroImg}
                      alt={a.title}
                      variant="card"
                    />
                  </Link>
                  <div className="flex flex-col flex-grow p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <Link
                        to={`/topics/${slugify(a.category)}`}
                        className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-white hover:bg-[hsl(var(--brand-red))] transition-colors"
                      >
                        {a.category}
                      </Link>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <Link to={`/article/${a.slug}`} className="flex-grow">
                      <h3 className="font-serif text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3 mb-3">
                        {a.title}
                      </h3>
                    </Link>
                    <p className="mt-auto text-sm text-muted-foreground line-clamp-2 mb-4">
                      {a.excerpt}
                    </p>

                    <div className="mt-auto pt-4 flex items-center gap-2 text-[11px] text-muted-foreground border-t border-border">
                      <span className="font-semibold text-foreground uppercase tracking-wider truncate">
                        {a.author}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
                      <span className="shrink-0">
                        {new Date(a.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border bg-secondary/50 py-24 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--brand-red))] text-white mb-4">
              <span className="font-serif text-2xl">!</span>
            </div>
            <p className="font-serif text-2xl font-bold text-foreground">No articles yet</p>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              Check back soon for new content.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary border-b-2 border-primary pb-1 hover:text-[hsl(var(--brand-red))] hover:border-[hsl(var(--brand-red))] transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default AllArticles;
