import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { client } from "@/lib/sanity";

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

const SkeletonInterviewCard = () => (
  <div className="animate-pulse grid gap-5 sm:grid-cols-[1fr_1.4fr]">
    <div className="aspect-[4/5] w-full bg-muted" />
    <div className="flex flex-col justify-center space-y-3 py-2">
      <div className="h-3 w-20 bg-muted rounded" />
      <div className="h-6 w-full bg-muted rounded" />
      <div className="h-6 w-4/5 bg-muted rounded" />
      <div className="h-4 w-32 bg-muted rounded mt-2" />
      <div className="h-3 w-24 bg-muted rounded" />
    </div>
  </div>
);

const Interview = () => {
  const [interviews, setInterviews] = useState<SanityInterview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch(`
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
        <meta name="description" content="Long-form conversations with the diplomats, scholars, and practitioners shaping the world from inside the room." />
      </Helmet>

      {/* Header */}
      <section className="border-b border-border">
        <div className="container-editorial py-12 lg:py-16">
          <p className="kicker">In Conversation</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            The Interview
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Long-form conversations with the diplomats, scholars, and practitioners shaping the world from inside the room.
          </p>
        </div>
      </section>

      {/* Interview list */}
      <section className="container-editorial py-12">
        {loading ? (
          <div className="grid gap-12">
            {[...Array(3)].map((_, i) => <SkeletonInterviewCard key={i} />)}
          </div>
        ) : interviews.length > 0 ? (
          <div className="grid gap-12">
            {interviews.map((interview, idx) => (
              <article
                key={interview._id}
                className="group grid gap-6 sm:grid-cols-[1fr_1.4fr] border border-border bg-background shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                style={{ borderLeft: "3px solid hsl(var(--brand-red))" }}
              >
                {/* Photo */}
                <div className="overflow-hidden bg-muted">
                  <img
                    src={interview.photoUrl}
                    alt={interview.personName}
                    loading={idx === 0 ? "eager" : "lazy"}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-6 lg:p-8">
                  <p className="kicker">
                    {new Date(interview.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>

                  <h2 className="mt-3 font-serif text-2xl font-bold leading-tight group-hover:text-primary transition-colors lg:text-3xl">
                    "{interview.title}"
                  </h2>

                  {interview.excerpt && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {interview.excerpt}
                    </p>
                  )}

                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-8 w-[2px] bg-[hsl(var(--brand-red))]" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {interview.personName}
                      </p>
                      <p className="text-xs text-muted-foreground">{interview.personRole}</p>
                    </div>
                  </div>

                  <Link
                    to={`/interview/${interview.slug}`}
                    className="mt-6 inline-flex items-center gap-2 self-start border-b-2 border-primary pb-1 text-xs font-bold uppercase tracking-widest text-primary hover:gap-3 hover:text-[hsl(var(--brand-red))] hover:border-[hsl(var(--brand-red))] transition-all duration-300"
                  >
                    Read Interview <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl font-bold">No interviews published yet.</p>
            <p className="mt-2 text-muted-foreground">Check back soon for long-form conversations.</p>
            <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
              ← Back to home
            </Link>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Interview;