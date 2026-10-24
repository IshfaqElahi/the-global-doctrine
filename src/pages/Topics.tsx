import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { TrendingSidebar } from "@/components/Sidebar";
import { CategoryCarousel, TopicCardData } from "@/components/CategoryCarousel";
import { SkeletonCardCompact } from "@/components/SkeletonCard";
import { EditorialImage } from "@/components/EditorialImage";
import { cleanText, isValidExcerpt } from "@/lib/editorialText";
import { categories } from "@/data/articles";
import { client } from "@/lib/sanity";
import heroImg from "@/assets/hero-summit.webp";

const slugify = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

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

const Topics = () => {
  const { category } = useParams();
  const cat = categories.find((c) => slugify(c) === category);

  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [carouselData, setCarouselData] = useState<TopicCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cat) return;

    setLoading(true);

    Promise.all([
      client.fetch(
        `*[
          (_type == "article" && category == $cat) || 
          (_type == "coverStory" && $cat == "Cover Story")
        ] | order(publishedAt desc){
          _id, title, "slug": slug.current, excerpt, 
          "category": coalesce(category, "Cover Story"),
          author, publishedAt, "imageUrl": mainImage.asset->url
        }`,
        { cat }
      ),
      client.fetch(`
        *[_type in ["article", "coverStory"]] | order(publishedAt desc){
          _id, title, "slug": slug.current, 
          "category": coalesce(category, "Cover Story"),
          author, publishedAt, "imageUrl": mainImage.asset->url
        }
      `),
    ])
      .then(([catArticles, allArticles]) => {
        setArticles(catArticles || []);
        const carousel: TopicCardData[] = categories.map((c, idx) => {
          const match = (allArticles || []).find((a: SanityArticle) => a.category === c);
          return {
            id: `topic-${idx}`,
            category: c,
            slug: slugify(c),
            title: match?.title || `Latest from ${c}`,
            author: match?.author || "The Global Doctrine",
            date: match
              ? new Date(match.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "",
            image: match?.imageUrl || heroImg,
            colorClass: ["Cover Story", "Asia", "Middle East"].includes(c)
              ? "bg-[hsl(var(--brand-red))]"
              : "bg-primary",
          };
        });
        setCarouselData(carousel);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [cat]);

  if (!cat) return <Navigate to="/" replace />;

  return (
    <Layout>
      <Helmet>
        <title>{cat} — The Global Doctrine</title>
        <meta name="description" content={`Reporting, analysis, and long-form commentary from across the ${cat} desk at The Global Doctrine.`} />
      </Helmet>

      <section className="border-b border-border bg-secondary editorial-grid-bg">
        <div className="container-editorial py-12 lg:py-16">
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="inline-block bg-[hsl(var(--brand-red))] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-4">
              Topic Desk
            </span>
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-foreground">
              {cat}
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg border-l-2 border-primary pl-4">
              Reporting, analysis, and long-form commentary from across the {cat.toLowerCase()} desk.
            </p>
          </motion.div>

          {/* Desk Switcher Pills */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((c) => {
              const active = c === cat;
              return (
                <Link
                  key={c}
                  to={`/topics/${slugify(c)}`}
                  className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all duration-200 shrink-0 ${
                    active
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-editorial py-12 lg:py-16 bg-background">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {loading ? (
              <div className="grid gap-8 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <SkeletonCardCompact key={i} />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid gap-8 sm:grid-cols-2"
              >
                {articles.map((a) => {
                  const cleanExcerpt = cleanText(a.excerpt);

                  return (
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
                          <h3 className="font-serif text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3 mb-3 text-balance">
                            {cleanText(a.title)}
                          </h3>
                        </Link>

                        {isValidExcerpt(cleanExcerpt) && (
                          <p className="mt-auto text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 text-pretty">
                            {cleanExcerpt}
                          </p>
                        )}

                        <div className="mt-auto pt-4 border-t border-border flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="font-semibold text-foreground uppercase tracking-wider truncate">
                            {a.author}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
                          <time dateTime={a.publishedAt} className="shrink-0">
                            {new Date(a.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </time>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border bg-secondary/50 py-24 text-center px-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--brand-red))] text-white mb-4">
                  <span className="font-serif text-2xl">!</span>
                </div>
                <p className="font-serif text-2xl font-bold text-foreground">No articles yet</p>
                <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                  Check back soon for coverage from the{" "}
                  <span className="font-semibold text-foreground">{cat}</span> desk.
                </p>
                <Link
                  to="/"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary border-b-2 border-primary pb-1 hover:text-[hsl(var(--brand-red))] hover:border-[hsl(var(--brand-red))] transition-colors"
                >
                  ← Back to Frontpage
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <TrendingSidebar />
          </div>
        </div>
      </section>

      <section className="border-t-4 border-primary bg-secondary editorial-grid-bg overflow-hidden">
        <div className="container-editorial py-16 relative">
          <div className="mb-10 flex items-end justify-between border-b-2 border-foreground pb-3">
            <div>
              <p className="kicker text-sm font-bold">Explore More</p>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Browse other topics</h2>
            </div>
          </div>
          <div className="-mx-4 sm:mx-0">
            <CategoryCarousel topics={carouselData} />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Topics;
