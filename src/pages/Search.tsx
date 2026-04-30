import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import { SkeletonCardCompact } from "@/components/SkeletonCard";
import { client } from "@/lib/sanity";

interface SearchResult {
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

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    client.fetch(`
      *[_type == "article" && (
        title match $q || excerpt match $q || category match $q || author match $q
      )] | order(publishedAt desc)[0...20]{
        _id, title, "slug": slug.current, excerpt, category,
        author, publishedAt, "imageUrl": mainImage.asset->url
      }
    `, { q: `*${query}*` })
      .then((data) => setResults(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <Layout>
      <Helmet>
        <title>Search: {query} — The Global Doctrine</title>
      </Helmet>

      <section className="border-b border-border bg-secondary">
        <div className="container-editorial py-12">
          <p className="kicker">Search results</p>
          <h1 className="mt-2 font-serif text-4xl font-bold">"{query}"</h1>
          {!loading && (
            <p className="mt-2 text-muted-foreground">
              {results.length} {results.length === 1 ? "result" : "results"} found
            </p>
          )}
        </div>
      </section>

      <section className="container-editorial py-16">
        {loading ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <SkeletonCardCompact key={i} />)}
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {results.map((a) => (
              <article key={a._id} className="group">
                <Link to={`/article/${a.slug}`} className="block overflow-hidden bg-muted">
                  <img src={a.imageUrl} alt={a.title} loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </Link>
                <div className="pt-3">
                  <Link to={`/topics/${slugify(a.category)}`}
                    className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-white">
                    {a.category}
                  </Link>
                  <Link to={`/article/${a.slug}`}>
                    <h3 className="mt-2 font-serif text-lg font-bold leading-tight text-foreground hover:text-primary transition-colors line-clamp-2">
                      {a.title}
                    </h3>
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a.author} · {new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl font-bold text-foreground">No results found</p>
            <p className="mt-2 text-muted-foreground">Try searching for a topic, region, or author.</p>
            <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
              ← Back to home
            </Link>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Search;