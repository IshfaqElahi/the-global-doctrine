import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { SkeletonCardHero } from "@/components/SkeletonCard";
import { ReferencesSection } from "@/components/ReferencesSection";
import { EditorialImage } from "@/components/EditorialImage";
import { EditorialPortableText } from "@/components/EditorialPortableText";
import { ShareButtons } from "@/components/ShareButtons";
import { cleanText, isValidExcerpt } from "@/lib/editorialText";
import { client } from "@/lib/sanity";
import { calcReadTime } from "@/lib/readTime";

interface Reference {
  text: string;
  url?: string;
  credit?: string;
}

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
  showReferences?: boolean;
  references?: Reference[];
}

const InterviewArticle = () => {
  const { slug } = useParams();
  const [interview, setInterview] = useState<SanityInterview | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    client
      .fetch(
        `*[_type == "interview" && slug.current == $slug][0]{
        title, "slug": slug.current, personName, personRole,
        publishedAt, excerpt, "photoUrl": photo.asset->url, body,
        showReferences,
        references[]{ text, url, credit }
      }`,
        { slug }
      )
      .then((data) => {
        if (data) setInterview(data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (notFound) return <Navigate to="/interview" replace />;

  const readTime = calcReadTime(interview?.body ?? []);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  if (loading) {
    return (
      <Layout>
        <div className="container-editorial py-16">
          <SkeletonCardHero />
        </div>
      </Layout>
    );
  }

  if (!interview) return null;

  const cleanTitle = cleanText(interview.title);
  const cleanExcerpt = cleanText(interview.excerpt);

  return (
    <Layout>
      <ReadingProgressBar />

      <Helmet>
        <title>{interview.personName} — The Global Doctrine Interview</title>
        <meta name="description" content={isValidExcerpt(cleanExcerpt) ? cleanExcerpt : `Interview with ${interview.personName}`} />
        <meta property="og:title" content={`"${cleanTitle}" — ${interview.personName}`} />
        <meta property="og:description" content={isValidExcerpt(cleanExcerpt) ? cleanExcerpt : `Interview with ${interview.personName}`} />
        <meta property="og:image" content={interview.photoUrl} />
        <meta property="og:url" content={pageUrl} />
      </Helmet>

      {/* Header */}
      <div className="border-b border-border bg-secondary/40 editorial-grid-bg">
        <div className="container-editorial py-10 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-3xl"
          >
            <Link
              to="/interview"
              className="kicker inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              ← In Conversation
            </Link>
            <h1 className="mt-4 font-serif text-3xl font-bold leading-[1.12] sm:text-5xl lg:text-6xl text-balance">
              {cleanTitle}
            </h1>
            {isValidExcerpt(cleanExcerpt) && (
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground border-l-2 border-primary pl-4 text-pretty">
                {cleanExcerpt}
              </p>
            )}
            <div className="mt-7 pt-5 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-[3px] bg-[hsl(var(--brand-red))]" />
                <div>
                  <p className="font-bold uppercase tracking-wider text-sm text-foreground">
                    {cleanText(interview.personName)}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {cleanText(interview.personRole)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <span>
                    {new Date(interview.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  {readTime > 0 && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[hsl(var(--brand-red))]" /> {readTime} min read
                      </span>
                    </>
                  )}
                </div>
                <ShareButtons url={pageUrl} title={cleanTitle} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Photo (Uncropped Adaptive Framing) */}
      {interview.photoUrl && (
        <div className="container-editorial mt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl overflow-hidden border border-border bg-muted shadow-lg"
          >
            <EditorialImage
              src={interview.photoUrl}
              alt={interview.personName}
              variant="feature"
              priority
            />
          </motion.div>
        </div>
      )}

      {/* Body */}
      <div className="container-editorial py-12 lg:py-16">
        <div className="mx-auto max-w-2xl">
          {interview.body?.length ? (
            <EditorialPortableText value={interview.body} />
          ) : (
            <p className="text-muted-foreground italic">Full interview content coming soon.</p>
          )}

          {/* References */}
          {interview.showReferences && interview.references && (
            <ReferencesSection references={interview.references} />
          )}

          <div className="mt-12 border-t border-border pt-6 flex items-center justify-between flex-wrap gap-4">
            <ShareButtons url={pageUrl} title={cleanTitle} />
            <Link
              to="/interview"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:gap-3 hover:text-[hsl(var(--brand-red))] transition-all duration-300"
            >
              ← More Interviews <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InterviewArticle;
