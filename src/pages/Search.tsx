import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, Variants } from "framer-motion";
import { Search as SearchIcon, ArrowUpRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SkeletonCardCompact } from "@/components/SkeletonCard";
import { EditorialImage } from "@/components/EditorialImage";
import { client } from "@/lib/sanity";
import heroImg from "@/assets/hero-summit.webp";

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

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [inputVal, setInputVal] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputVal(query);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    client
      .fetch(
        `*[_type in ["article", "coverStory"] && (
        title match $q || excerpt match $q || category match $q || author match $q || (_type == "coverStory" && "cover story" match $q)
      )] | order(publishedAt desc)[0...20]{
        _id, title, "slug": slug.current, excerpt, 
        "category": coalesce(category, "Cover Story"),
        author, publishedAt, "imageUrl": mainImage.asset->url
      }`,
        { q: `*${query}*` }
      )
      .then((data) => setResults(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  const handleRefine = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Search: {query} — The Global Doctrine</title>
      </Helmet>

      <section className="border-b border-border bg-secondary editorial-grid-bg">
        <div className="container-editorial py-12 lg:py-16">
          <p className="kicker">Archive Search</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-foreground">
            {query ? `"${query}"` : "Search Dispatches"}
          </h1>
          {!loading && query && (
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg border-l-2 border-primary pl-4">
              {results.length} {results.length === 1 ? "result" : "results"} found
            </p>
          )}

          <form onSubmit={handleRefine} className="mt-6 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Search by topic, region, headline, or author..."
                className="w-full border border-border bg-background pl-10 pr-4 py-2.5 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-[hsl(var(--brand-red))] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-primary transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="container-editorial py-16">
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCardCompact key={i} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {results.map((a) => (
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
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-all" />
                  </div>
                  <Link to={`/article/${a.slug}`} className="flex-grow">
                    <h3 className="font-serif text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3 mb-3">
                      {a.title}
                    </h3>
                  </Link>

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
        ) : (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border bg-secondary/50 py-24 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--brand-red))] text-white mb-4">
              <span className="font-serif text-2xl">!</span>
            </div>
            <p className="font-serif text-2xl font-bold text-foreground">No results found</p>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              Try searching for a different topic, region, or author.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary border-b-2 border-primary pb-1 hover:text-[hsl(var(--brand-red))] hover:border-[hsl(var(--brand-red))] transition-colors"
            >
              ← Back to Frontpage
            </Link>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Search;
