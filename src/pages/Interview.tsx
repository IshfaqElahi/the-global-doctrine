import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Layout } from "@/components/Layout";
import { EditorialImage } from "@/components/EditorialImage";
import { cleanText, isValidExcerpt } from "@/lib/editorialText";
import { client } from "@/lib/sanity";
import heroImg from "@/assets/hero-summit.webp";

interface SanityInterview {
  _id: string;
  title: string;
  slug: string;
  personName: string;
  personRole: string;
  publishedAt: string;
  excerpt: string;
  photoUrl: string;
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const SkeletonInterviewCard = () => (
  <div className="animate-pulse grid gap-5 sm:grid-cols-[1fr_1.4fr] border border-border bg-background p-4">
    <div className="aspect-[4/5] w-full bg-muted" />
    <div className="flex flex-col justify-center space-y-4 py-2">
      <div className="h-3 w-24 bg-muted rounded" />
      <div className="h-8 w-full bg-muted rounded" />
      <div className="h-8 w-4/5 bg-muted rounded" />
      <div className="h-4 w-3/4 bg-muted rounded mt-4" />
      <div className="h-4 w-1/2 bg-muted rounded" />
      <div className="h-10 w-32 bg-muted rounded mt-6" />
    </div>
  </div>
);

const Interview = () => {
  const [interviews, setInterviews] = useState<SanityInterview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(`
      *[_type == "interview"] | order(publishedAt desc){
        _id,
        title,
        "slug": slug.current,
        personName,
        personRole,
        publishedAt,
        excerpt,
        "photoUrl": photo.asset->url
      }
    `)
      .then((data) => setInterviews(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Interview — The Global Doctrine</title>
        <meta
          name="description"
          content="Long-form conversations with the diplomats, scholars, and practitioners shaping the world from inside the room."
        />
      </Helmet>

      {/* Header */}
      <section className="border-b border-border bg-secondary editorial-grid-bg">
        <div className="container-editorial py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="kicker inline-flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[hsl(var(--brand-red))]" />
              In Conversation
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-foreground">
              The Interview
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg border-l-2 border-primary pl-4">
              Long-form conversations with the diplomats, scholars, and practitioners shaping the world from inside the room.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interview list */}
      <section className="container-editorial py-16">
        {loading ? (
          <div className="grid gap-12">
            {[...Array(3)].map((_, i) => (
              <SkeletonInterviewCard key={i} />
            ))}
          </div>
        ) : interviews.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-12"
          >
            {interviews.map((interview, idx) => (
              <motion.article
                key={interview._id}
                variants={fadeUpItem}
                className="group editorial-card grid gap-6 sm:grid-cols-[1fr_1.45fr] overflow-hidden"
                style={{ borderLeft: "4px solid hsl(var(--brand-red))" }}
              >
                {/* Photo */}
                <Link to={`/interview/${interview.slug}`} className="block overflow-hidden bg-muted">
                  <EditorialImage
                    src={interview.photoUrl || heroImg}
                    alt={interview.personName}
                    variant="portrait"
                    priority={idx === 0}
                  />
                </Link>

                {/* Content */}
                <div className="relative flex flex-col justify-center p-6 lg:p-10">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute top-4 right-6 font-serif text-8xl font-bold leading-none text-primary/10"
                  >
                    &rdquo;
                  </span>

                  <p className="kicker">
                    {new Date(interview.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>

                  <Link to={`/interview/${interview.slug}`} className="mt-3 block">
                    <h2 className="font-serif text-2xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors lg:text-4xl">
                      &ldquo;{cleanText(interview.title)}&rdquo;
                    </h2>
                  </Link>

                  {isValidExcerpt(interview.excerpt) && (
                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground line-clamp-3 sm:text-base">
                      {cleanText(interview.excerpt)}
                    </p>
                  )}

                  <div className="mt-6 flex items-center gap-3.5">
                    <div className="h-10 w-[3px] bg-[hsl(var(--brand-red))]" />
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                        {interview.personName}
                      </p>
                      <p className="text-sm text-muted-foreground italic mt-0.5">
                        {interview.personRole}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/interview/${interview.slug}`}
                    className="group/btn mt-8 inline-flex items-center gap-2 self-start border-b-2 border-primary pb-1 text-xs font-bold uppercase tracking-widest text-primary hover:text-[hsl(var(--brand-red))] hover:border-[hsl(var(--brand-red))] transition-all duration-300"
                  >
                    Read Interview
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border bg-secondary/50 py-24 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--brand-red))] text-white mb-4">
              <span className="font-serif text-2xl">!</span>
            </div>
            <p className="font-serif text-2xl font-bold text-foreground">No interviews yet.</p>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              Check back soon for long-form conversations.
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

export default Interview;
