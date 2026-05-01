import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Clock, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { SkeletonCardHero } from "@/components/SkeletonCard";
import { client, urlFor } from "@/lib/sanity";
import { calcReadTime } from "@/lib/readTime";

interface SanityInterview {
  title: string;
  slug: string;
  personName: string;
  personRole: string;
  publishedAt: string;
  excerpt: string;
  photoUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[];
}

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
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
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
        <img src={urlFor(value).width(1200).url()} alt={value.alt || ""} className="w-full object-cover" loading="lazy" />
        {value.alt && <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">{value.alt}</figcaption>}
      </figure>
    ),
  },
};

const InterviewArticle = () => {
  const { slug } = useParams();
  const [interview, setInterview] = useState<SanityInterview | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    client.fetch(`
      *[_type == "interview" && slug.current == $slug][0]{
        title, "slug": slug.current, personName, personRole,
        publishedAt, excerpt, "photoUrl": photo.asset->url, body
      }
    `, { slug })
      .then((data) => { if (data) setInterview(data); else setNotFound(true); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (notFound) return <Navigate to="/interview" replace />;

  const readTime = calcReadTime(interview?.body ?? []);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  if (loading) {
    return (
      <Layout>
        <div className="container-editorial py-16"><SkeletonCardHero /></div>
      </Layout>
    );
  }

  if (!interview) return null;

  return (
    <Layout>
      <ReadingProgressBar />

      <Helmet>
        <title>{interview.personName} — The Global Doctrine Interview</title>
        <meta name="description" content={interview.excerpt} />
        <meta property="og:title" content={`"${interview.title}" — ${interview.personName}`} />
        <meta property="og:description" content={interview.excerpt} />
        <meta property="og:image" content={interview.photoUrl} />
        <meta property="og:url" content={pageUrl} />
      </Helmet>

      {/* Header */}
      <div className="border-b border-border bg-background">
        <div className="container-editorial py-10 lg:py-14">
          <div className="mx-auto max-w-3xl">
            <Link to="/interview" className="kicker inline-flex items-center gap-1 hover:gap-2 transition-all">
              ← In Conversation
            </Link>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
              "{interview.title}"
            </h1>
            {interview.excerpt && (
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{interview.excerpt}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-[2px] bg-[hsl(var(--brand-red))]" />
                <div>
                  <p className="font-semibold text-foreground">{interview.personName}</p>
                  <p className="text-xs text-muted-foreground">{interview.personRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{new Date(interview.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                {readTime > 0 && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {readTime} min read
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo */}
      {interview.photoUrl && (
        <div className="container-editorial">
          <div className="overflow-hidden bg-muted">
            <img src={interview.photoUrl} alt={interview.personName}
              className="aspect-[16/9] w-full object-cover object-top" />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="container-editorial py-12">
        <div className="mx-auto max-w-2xl">
          {interview.body?.length ? (
            <div className="[&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-3 [&>p:first-child]:first-letter:font-serif [&>p:first-child]:first-letter:text-7xl [&>p:first-child]:first-letter:font-bold [&>p:first-child]:first-letter:leading-[0.85] [&>p:first-child]:first-letter:text-[hsl(var(--brand-red))]">
              <PortableText value={interview.body} components={ptComponents} />
            </div>
          ) : (
            <p className="text-muted-foreground italic">Full interview content coming soon.</p>
          )}

          <div className="mt-12 border-t border-border pt-8">
            <Link to="/interview"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:gap-3 hover:text-[hsl(var(--brand-red))] transition-all duration-300">
              ← More Interviews <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InterviewArticle;