import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, Variants } from "framer-motion";
import { Layout } from "@/components/Layout";
import { SkeletonCardCompact } from "@/components/SkeletonCard";
import { client } from "@/lib/sanity";

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

// --- Framer Motion Animation Variants ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
// ----------------------------------------

const AllArticles = () => {
  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch(`
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

  return (
    <Layout>
      <Helmet>
        <title>All Articles — The Global Doctrine</title>
      </Helmet>

      <section className="border-b border-border bg-secondary">
        <div className="container-editorial py-12 lg:py-16">
          <p className="kicker">Archive</p>
          <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl lg:text-6xl text-foreground">All Articles</h1>
          {!loading && (
            <p className="mt-4 text-base text-muted-foreground sm:text-lg border-l-2 border-primary pl-4">
              {articles.length} articles published
            </p>
          )}
        </div>
      </section>

      <section className="container-editorial py-16">
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => <SkeletonCardCompact key={i} />)}
          </div>
        ) : articles.length > 0 ? (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {articles.map((a) => (
              <motion.article 
                key={a._id} 
                variants={fadeUpItem}
                className="group flex flex-col bg-background border border-border hover:border-primary/40 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
              >
                <Link to={`/article/${a.slug}`} className="block overflow-hidden bg-muted">
                  <img src={`${a.imageUrl}?auto=format&w=800&q=80`} alt={a.title} loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                </Link>
                <div className="flex flex-col flex-grow p-5">
                  <div className="mb-3">
                    <Link to={`/topics/${slugify(a.category)}`}
                      className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-white hover:bg-black transition-colors">
                      {a.category}
                    </Link>
                  </div>
                  <Link to={`/article/${a.slug}`} className="flex-grow">
                    <h3 className="font-serif text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-3 mb-3">
                      {a.title}
                    </h3>
                  </Link>
                  <p className="mt-auto text-sm text-muted-foreground line-clamp-2 mb-4">{a.excerpt}</p>
                  
                  <div className="mt-auto pt-4 flex items-center gap-2 text-[11px] text-muted-foreground border-t border-border">
                    <span className="font-semibold text-foreground uppercase tracking-wider">{a.author}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                    <span>{new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border bg-secondary/50 py-24 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--brand-red))] text-white mb-4">
              <span className="font-serif text-2xl">!</span>
            </div>
            <p className="font-serif text-2xl font-bold text-foreground">No articles yet</p>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">Check back soon for new content.</p>
            <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary border-b-2 border-primary pb-1 hover:text-[hsl(var(--brand-red))] hover:border-[hsl(var(--brand-red))] transition-colors">← Back to home</Link>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default AllArticles;