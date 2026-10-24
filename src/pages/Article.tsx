import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Twitter, Linkedin, Share2, Check, Clock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { TrendingSidebar } from "@/components/Sidebar";
import { SkeletonCardHero } from "@/components/SkeletonCard";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { ReferencesSection } from "@/components/ReferencesSection";
import { EditorialImage } from "@/components/EditorialImage";
import { EditorialPortableText } from "@/components/EditorialPortableText";
import { cleanText, isValidExcerpt } from "@/lib/editorialText";
import { client } from "@/lib/sanity";
import { calcReadTime } from "@/lib/readTime";
import { articles } from "@/data/articles";

const slugify = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

interface Reference {
  text: string;
  url?: string;
  credit?: string;
}

interface SanityArticle {
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[];
  seoTitle?: string;
  seoDescription?: string;
  showReferences?: boolean;
  references?: Reference[];
}

// ── Share buttons ─────────────────────────────────────────
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
    <div className="flex items-center gap-2.5">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        Share
      </span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground transition-all hover:bg-black hover:text-white hover:border-black"
        aria-label="Share on X"
      >
        <Twitter className="h-3.5 w-3.5" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground transition-all hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5]"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-3.5 w-3.5" />
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground transition-all hover:bg-[#25D366] hover:text-white hover:border-[#25D366]"
        aria-label="Share on WhatsApp"
      >
        <span className="text-xs font-bold">W</span>
      </a>
      <button
        onClick={copy}
        className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground transition-all hover:bg-primary hover:text-white hover:border-primary"
        aria-label="Copy link"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
};

// ── Related articles ──────────────────────────────────────
const RelatedArticles = ({
  category,
  currentSlug,
}: {
  category: string;
  currentSlug: string;
}) => {
  const [related, setRelated] = useState<SanityArticle[]>([]);

  useEffect(() => {
    client
      .fetch(
        `*[_type in ["article", "coverStory"] && coalesce(category, "Cover Story") == $category && slug.current != $slug] | order(publishedAt desc)[0...3]{
          title, "slug": slug.current, "category": coalesce(category, "Cover Story"), author, publishedAt, "imageUrl": mainImage.asset->url
        }`,
        { category, slug: currentSlug }
      )
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
        <h3 className="mt-2 font-serif text-2xl font-bold">Related Dispatches</h3>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {related.map((a) => (
          <article
            key={a.slug}
            className="group editorial-card flex flex-col overflow-hidden"
            style={{ borderLeft: "3px solid hsl(var(--brand-red))" }}
          >
            <Link to={`/article/${a.slug}`} className="block overflow-hidden">
              <EditorialImage
                src={a.imageUrl}
                alt={cleanText(a.title)}
                variant="card"
              />
            </Link>
            <div className="flex flex-col flex-grow p-4">
              <Link
                to={`/topics/${slugify(a.category || "cover-story")}`}
                className="inline-block self-start px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-white"
              >
                {a.category || "Cover Story"}
              </Link>
              <Link to={`/article/${a.slug}`} className="mt-2 flex-grow">
                <h4 className="font-serif text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 text-balance">
                  {cleanText(a.title)}
                </h4>
              </Link>
              <p className="mt-3 pt-2.5 border-t border-border text-[11px] text-muted-foreground">
                {a.author} &middot;{" "}
                {new Date(a.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

// ── Main Article page ─────────────────────────────────────
const Article = () => {
  const { slug } = useParams();
  const [sanityArticle, setSanityArticle] = useState<SanityArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const staticArticle = articles.find((a) => a.slug === slug);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    client
      .fetch(
        `*[_type in ["article", "coverStory"] && slug.current == $slug][0]{
          title, "slug": slug.current, excerpt, "category": coalesce(category, "Cover Story"), author, publishedAt,
          "imageUrl": mainImage.asset->url, body, seoTitle, seoDescription,
          showReferences,
          references[]{ text, url, credit }
        }`,
        { slug }
      )
      .then((data) => {
        if (data) setSanityArticle(data);
        else if (!staticArticle) setNotFound(true);
      })
      .catch(() => {
        if (!staticArticle) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug, staticArticle]);

  if (notFound) return <Navigate to="/" replace />;

  const title = cleanText(sanityArticle?.title ?? staticArticle?.title ?? "");
  const excerpt = cleanText(sanityArticle?.excerpt ?? staticArticle?.excerpt ?? "");
  const category = sanityArticle?.category ?? staticArticle?.category ?? "Cover Story";
  const author = cleanText(sanityArticle?.author ?? staticArticle?.author ?? "");
  const image = sanityArticle?.imageUrl ?? (staticArticle?.image as string) ?? "";
  const date = sanityArticle
    ? new Date(sanityArticle.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : staticArticle?.date ?? "";
  const readTime = calcReadTime(sanityArticle?.body ?? []);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const metaTitle = sanityArticle?.seoTitle
    ? `${cleanText(sanityArticle.seoTitle)} — The Global Doctrine`
    : `${title} — The Global Doctrine`;
  const metaDescription = cleanText(sanityArticle?.seoDescription) || excerpt;

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
      <ReadingProgressBar />

      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        {image && <meta property="og:image" content={image} />}
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <article>
        {/* Header */}
        <div className="border-b border-border bg-secondary/40 editorial-grid-bg">
          <div className="container-editorial py-10 lg:py-14">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mx-auto max-w-3xl"
            >
              <div className="flex items-center gap-3">
                <Link
                  to={`/topics/${slugify(category)}`}
                  className="inline-block bg-[hsl(var(--brand-red))] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-primary transition-colors"
                >
                  {category}
                </Link>
                <Link
                  to="/all-articles"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" /> Archive
                </Link>
              </div>
              <h1 className="mt-5 font-serif text-3xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.35rem] text-balance">
                {title}
              </h1>
              {isValidExcerpt(excerpt) && (
                <p className="mt-5 text-base sm:text-xl leading-relaxed text-muted-foreground border-l-2 border-primary pl-4 text-pretty">
                  {excerpt}
                </p>
              )}
              <div className="mt-7 pt-5 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-bold uppercase tracking-wider text-xs text-foreground">
                    By {author}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">{date}</span>
                  {readTime > 0 && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-[hsl(var(--brand-red))]" />
                        {readTime} min read
                      </span>
                    </>
                  )}
                </div>
                <ShareButtons url={pageUrl} title={title} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero image */}
        {image && (
          <div className="container-editorial mt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-4xl overflow-hidden border border-border bg-muted shadow-lg"
            >
              <EditorialImage
                src={image}
                alt={title}
                variant="feature"
                priority
              />
            </motion.div>
          </div>
        )}

        {/* Body */}
        <div className="container-editorial py-12 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="mx-auto max-w-2xl">
                {sanityArticle?.body?.length ? (
                  <EditorialPortableText value={sanityArticle.body} />
                ) : (
                  <div className="space-y-6 text-lg leading-[1.85] text-foreground/90">
                    {isValidExcerpt(excerpt) && (
                      <p className="editorial-dropcap text-pretty">{excerpt}</p>
                    )}
                    <p className="text-muted-foreground italic border-l-4 border-border pl-4">
                      Full article content coming soon.
                    </p>
                  </div>
                )}

                {/* Bottom share */}
                <div className="mt-12 border-t border-border pt-6 flex items-center justify-between flex-wrap gap-4">
                  <ShareButtons url={pageUrl} title={title} />
                  <Link
                    to="/all-articles"
                    className="text-xs font-bold uppercase tracking-widest text-primary hover:text-[hsl(var(--brand-red))] transition-colors"
                  >
                    ← Back to All Dispatches
                  </Link>
                </div>

                {/* References */}
                {sanityArticle?.showReferences && sanityArticle?.references && (
                  <ReferencesSection references={sanityArticle.references} />
                )}

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
