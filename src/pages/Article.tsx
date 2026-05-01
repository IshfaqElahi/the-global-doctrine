import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Twitter, Linkedin, Share2, Check, Clock } from "lucide-react";
import { Layout } from "@/components/Layout";
import { TrendingSidebar } from "@/components/Sidebar";
import { SkeletonCardHero } from "@/components/SkeletonCard";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { client, urlFor } from "@/lib/sanity";
import { calcReadTime } from "@/lib/readTime";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[];
}

// Portable text component map — editorial styled
const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-lg leading-[1.85] text-foreground/90">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-12 font-serif text-3xl font-bold text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 font-serif text-2xl font-bold text-foreground">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-[hsl(var(--brand-red))] pl-6 font-serif text-2xl italic leading-snug text-foreground">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:text-[hsl(var(--brand-red))] transition-colors">
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => (
      <figure className="my-10">
        <img
          src={urlFor(value).width(1200).url()}
          alt={value.alt || ""}
          className="w-full object-cover"
          loading="lazy"
        />
        {value.alt && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
            {value.alt}
          </figcaption>
        )}
      </figure>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 ml-6 list-disc space-y-2 text-lg leading-relaxed">{children}</ul>,
    number: ({ children }) => <ol className="mb-6 ml-6 list-decimal space-y-2 text-lg leading-relaxed">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-foreground/90">{children}</li>,
    number: ({ children }) => <li className="text-foreground/90">{children}</li>,
  },
};

// Social share buttons
const ShareButtons = ({ url, title }: { url: string; title: string }) => {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Share</span>
      <a href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
        target="_blank" rel="noopener noreferrer"
        className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground transition-all hover:bg-black hover:text-white hover:border-black"
        aria-label="Share on X">
        <Twitter className="h-3.5 w-3.5" />
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank" rel="noopener noreferrer"
        className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground transition-all hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5]"
        aria-label="Share on LinkedIn">
        <Linkedin className="h-3.5 w-3.5" />
      </a>
      <a href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
        target="_blank" rel="noopener noreferrer"
        className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground transition-all hover:bg-[#25D366] hover:text-white hover:border-[#25D366]"
        aria-label="Share on WhatsApp">
        <span className="text-xs font-bold">W</span>
      </a>
      <button onClick={copy}
        className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground transition-all hover:bg-primary hover:text-white hover:border-primary"
        aria-label="Copy link">
        {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
};

// Related articles
const RelatedArticles = ({ category, currentSlug }: { category: string; currentSlug: string }) => {
  const [related, setRelated] = useState<SanityArticle[]>([]);

  useEffect(() => {
    client.fetch(`
      *[_type == "article" && category == $category && slug.current != $slug] | order(publishedAt desc)[0...3]{
        title, "slug": slug.current, category, author, publishedAt, "imageUrl": mainImage.asset->url
      }
    `, { category, slug: currentSlug })
      .then((data) => setRelated(data || []))
      .catch(console.error);
  }, [category, currentSlug]);

  if (!related.length) return null;

  return (
    <section className="border-t border-border mt-16 pt-12">
      <div className="mb-8">
        <span className="inline-flex items-center gap-2">
          <span className="h-[2px] w-6 bg-[hsl(var(--brand-red))]" />
          <p className="kicker">More from {category}</p>
        </span>
        <h3 className="mt-2 font-serif text-2xl font-bold">Related Articles</h3>
      </div>
      <div className="grid gap-8 sm:grid-cols-3">
        {related.map((a) => (
          <article key={a.slug} className="group border border-border bg-background shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300" style={{ borderLeft: "3px solid hsl(var(--brand-red))" }}>
            <Link to={`/article/${a.slug}`} className="block overflow-hidden">
              <img src={a.imageUrl} alt={a.title} loading="lazy"
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </Link>
            <div className="p-4">
              <Link to={`/topics/${slugify(a.category)}`}
                className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-white">
                {a.category}
              </Link>
              <Link to={`/article/${a.slug}`}>
                <h4 className="mt-2 font-serif text-base font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {a.title}
                </h4>
              </Link>
              <p className="mt-2 text-xs text-muted-foreground">
                {a.author} · {new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const Article = () => {
  const { slug } = useParams();
  const [sanityArticle, setSanityArticle] = useState<SanityArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const staticArticle = articles.find((a) => a.slug === slug);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    client.fetch(`
      *[_type == "article" && slug.current == $slug][0]{
        title, "slug": slug.current, excerpt, category, author, publishedAt,
        "imageUrl": mainImage.asset->url, body
      }
    `, { slug })
      .then((data) => {
        if (data) setSanityArticle(data);
        else if (!staticArticle) setNotFound(true);
      })
      .catch(() => { if (!staticArticle) setNotFound(true); })
      .finally(() => setLoading(false));
  }, [slug, staticArticle]);

  if (notFound) return <Navigate to="/" replace />;

  const title = sanityArticle?.title ?? staticArticle?.title ?? "";
  const excerpt = sanityArticle?.excerpt ?? staticArticle?.excerpt ?? "";
  const category = sanityArticle?.category ?? staticArticle?.category ?? "";
  const author = sanityArticle?.author ?? staticArticle?.author ?? "";
  const image = sanityArticle?.imageUrl ?? (staticArticle?.image as string) ?? "";
  const date = sanityArticle
    ? new Date(sanityArticle.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : staticArticle?.date ?? "";
  const readTime = calcReadTime(sanityArticle?.body ?? []);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  if (loading) {
    return (
      <Layout>
        <div className="container-editorial py-16"><SkeletonCardHero /></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ReadingProgressBar />

      <Helmet>
        <title>{title} — The Global Doctrine</title>
        <meta name="description" content={excerpt} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:type" content="article" />
        {image && <meta property="og:image" content={image} />}
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <article>
        {/* Article header */}
        <div className="border-b border-border bg-background">
          <div className="container-editorial py-10 lg:py-14">
            <div className="mx-auto max-w-3xl">
              <Link to={`/topics/${slugify(category)}`} className="kicker">{category}</Link>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">{excerpt}</p>

              {/* Meta row */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-semibold text-foreground">By {author}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span className="text-muted-foreground">{date}</span>
                  {readTime > 0 && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {readTime} min read
                      </span>
                    </>
                  )}
                </div>
                <ShareButtons url={pageUrl} title={title} />
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
              <div className="mx-auto max-w-2xl">
                {sanityArticle?.body?.length ? (
                  // First paragraph gets drop cap via wrapper
                  <div className="[&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-3 [&>p:first-child]:first-letter:font-serif [&>p:first-child]:first-letter:text-7xl [&>p:first-child]:first-letter:font-bold [&>p:first-child]:first-letter:leading-[0.85] [&>p:first-child]:first-letter:text-[hsl(var(--brand-red))]">
                    <PortableText value={sanityArticle.body} components={ptComponents} />
                  </div>
                ) : (
                  <div className="space-y-6 text-lg leading-[1.85] text-foreground/90">
                    <p className="first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-[hsl(var(--brand-red))]">
                      {excerpt}
                    </p>
                    <p className="text-muted-foreground italic border-l-4 border-border pl-4">
                      Full article content coming soon.
                    </p>
                  </div>
                )}

                {/* Bottom share */}
                <div className="mt-12 border-t border-border pt-6">
                  <ShareButtons url={pageUrl} title={title} />
                </div>

                {/* Related articles */}
                {category && slug && (
                  <RelatedArticles category={category} currentSlug={slug} />
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