import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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

const AllArticles = () => {
  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch(`
      *[_type == "article"] | order(publishedAt desc){
        _id, title, "slug": slug.current, excerpt, category,
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
        <div className="container-editorial py-12">
          <p className="kicker">Archive</p>
          <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">All Articles</h1>
          {!loading && (
            <p className="mt-2 text-muted-foreground">{articles.length} articles published</p>
          )}
        </div>
      </section>

      <section className="container-editorial py-16">
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => <SkeletonCardCompact key={i} />)}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {articles.map((a) => (
              <article key={a._id} className="group bg-background border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                <Link to={`/article/${a.slug}`} className="block overflow-hidden">
                  <img src={a.imageUrl} alt={a.title} loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </Link>
                <div className="p-4">
                  <Link to={`/topics/${slugify(a.category)}`}
                    className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-white">
                    {a.category}
                  </Link>
                  <Link to={`/article/${a.slug}`}>
                    <h3 className="mt-2 font-serif text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {a.title}
                    </h3>
                  </Link>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{a.excerpt}</p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground border-t border-border pt-3">
                    <span className="font-semibold text-foreground">{a.author}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                    <span>{new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl font-bold">No articles yet</p>
            <p className="mt-2 text-muted-foreground">Check back soon.</p>
            <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">← Back to home</Link>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default AllArticles;