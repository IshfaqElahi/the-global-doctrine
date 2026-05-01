import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { TrendingSidebar } from "@/components/Sidebar";
import { CategoryCarousel, TopicCardData } from "@/components/CategoryCarousel";
import { SkeletonCardCompact } from "@/components/SkeletonCard";
import { categories } from "@/data/articles";
import { client } from "@/lib/sanity";
import heroImg from "@/assets/hero-summit.jpg";

const slugify = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

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

    Promise.all([
      client.fetch(`
        *[_type == "article" && category == $cat] | order(publishedAt desc){
          _id, title, "slug": slug.current, excerpt, category,
          author, publishedAt, "imageUrl": mainImage.asset->url
        }
      `, { cat }),
      client.fetch(`
        *[_type == "article"] | order(publishedAt desc){
          _id, title, "slug": slug.current, category,
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
            date: match ? new Date(match.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "",
            image: match?.imageUrl || heroImg,
            colorClass: ["Cover Story", "Asia", "Middle East"].includes(c) ? "bg-[hsl(var(--brand-red))]" : "bg-primary",
          };
        });
        setCarouselData(carousel);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [cat]);

  // ✅ Redirect check AFTER all hooks
  if (!cat) return <Navigate to="/" replace />;

  return (
    <Layout>
      <section className="border-b border-border bg-secondary">
        <div className="container-editorial py-12 lg:py-16">
          <p className="kicker">Topic</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{cat}</h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Reporting, analysis, and long-form commentary from across the {cat.toLowerCase()} desk.
          </p>
          <div className="mt-12 -mx-4 sm:mx-0">
            <CategoryCarousel topics={carouselData} />
          </div>
        </div>
      </section>

      <section className="container-editorial py-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {loading ? (
              <div className="grid gap-10 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => <SkeletonCardCompact key={i} />)}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid gap-10 sm:grid-cols-2">
                {articles.map((a) => (
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
                <p className="font-serif text-2xl font-bold">No articles yet</p>
                <p className="mt-2 text-muted-foreground">Check back soon for coverage from the {cat} desk.</p>
                <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">← Back to home</Link>
              </div>
            )}
          </div>
          <div className="lg:col-span-4">
            <TrendingSidebar />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Topics;