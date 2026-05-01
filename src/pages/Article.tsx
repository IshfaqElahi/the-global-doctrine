import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import { TrendingSidebar } from "@/components/Sidebar";
import { SkeletonCardHero } from "@/components/SkeletonCard";
import { client } from "@/lib/sanity";
import { articles } from "@/data/articles";

const slugify = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

interface SanityArticle {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  body: { _type: string; style?: string; children?: { text: string }[] }[];
}

const Article = () => {
  const { slug } = useParams();
  const [sanityArticle, setSanityArticle] = useState<SanityArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Fallback to static data
  const staticArticle = articles.find((a) => a.slug === slug);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    client.fetch(`
      *[_type == "article" && slug.current == $slug][0]{
        title,
        "slug": slug.current,
        excerpt,
        category,
        author,
        publishedAt,
        "imageUrl": mainImage.asset->url,
        body
      }
    `, { slug })
      .then((data) => {
        if (data) setSanityArticle(data);
        else if (!staticArticle) setNotFound(true);
      })
      .catch(() => { if (!staticArticle) setNotFound(true); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (notFound) return <Navigate to="/" replace />;

  // Use Sanity data if available, otherwise fall back to static
  const title = sanityArticle?.title ?? staticArticle?.title ?? "";
  const excerpt = sanityArticle?.excerpt ?? staticArticle?.excerpt ?? "";
  const category = sanityArticle?.category ?? staticArticle?.category ?? "";
  const author = sanityArticle?.author ?? staticArticle?.author ?? "";
  const image = sanityArticle?.imageUrl ?? (staticArticle?.image as string) ?? "";
  const date = sanityArticle
    ? new Date(sanityArticle.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : staticArticle?.date ?? "";

  if (loading) {
    return (
      <Layout>
        <div className="container-editorial py-16">
          <SkeletonCardHero />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{title} — The Global Doctrine</title>
        <meta name="description" content={excerpt} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        {image && <meta property="og:image" content={image} />}
      </Helmet>

      <article>
        {/* Header */}
        <div className="border-b border-border">
          <div className="container-editorial py-10 lg:py-14">
            <div className="mx-auto max-w-3xl">
              <Link to={`/topics/${slugify(category)}`} className="kicker">{category}</Link>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">{excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-semibold text-foreground">By {author}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">{date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero image */}
        {image && (
          <div className="container-editorial">
            <div className="-mt-px overflow-hidden bg-muted">
              <img src={image} alt={title} className="aspect-[16/9] w-full object-cover" />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="container-editorial py-12">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="mx-auto max-w-2xl space-y-6 text-lg leading-[1.75] text-foreground/90">
                {sanityArticle?.body?.length ? (
                  sanityArticle.body.map((block, i) => {
                    if (block._type !== "block") return null;
                    const text = block.children?.map((c) => c.text).join("") ?? "";
                    return (
                      <p key={i} className={i === 0
                        ? "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-[hsl(var(--brand-red))]"
                        : ""}>
                        {text}
                      </p>
                    );
                  })
                ) : (
                  // Static fallback body
                  <>
                    <p className="first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-[hsl(var(--brand-red))]">
                      {excerpt}
                    </p>
                    <p className="text-muted-foreground italic">Full article content coming soon.</p>
                  </>
                )}
              </div>
            </div>
            <div className="lg:col-span-4">
              <TrendingSidebar />
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default Article;