import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Sparkles, BookOpen, Globe2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion, Variants } from "framer-motion";
import { Layout } from "@/components/Layout";
import { CategoryCarousel, TopicCardData } from "@/components/CategoryCarousel";
import { SkeletonCardHero, SkeletonCardCompact, SkeletonCarouselCard } from "@/components/SkeletonCard";
import { DoctrineBrief } from "@/components/DoctrineBrief";
import { EditorialImage } from "@/components/EditorialImage";
import { categories } from "@/data/articles";
import { client, urlFor } from "@/lib/sanity";
import heroImg from "@/assets/hero-summit.webp";

interface CoverStory {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
}

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

interface MagazineIssue {
  _id: string;
  title: string;
  issue: string;
  publishDate: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverImage: any;
}

interface LatestInterview {
  title: string;
  slug: string;
  personName: string;
  personRole: string;
  excerpt: string;
  photoUrl: string;
}

const slugify = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

// --- Framer Motion Animation Variants ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const heroTextContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const heroTextItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
// ----------------------------------------

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [coverStory, setCoverStory] = useState<CoverStory | null>(null);
  const [latestArticles, setLatestArticles] = useState<SanityArticle[]>([]);
  const [magazines, setMagazines] = useState<MagazineIssue[]>([]);
  const [latestInterview, setLatestInterview] = useState<LatestInterview | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coverData, articlesData, magData, interviewData] = await Promise.all([
          client.fetch(`
            *[_type == "coverStory"] | order(publishedAt desc)[0]{
              title, "slug": slug.current, excerpt, author, publishedAt,
              "imageUrl": mainImage.asset->url
            }
          `),
          client.fetch(`
            *[_type == "article"] | order(publishedAt desc)[0...8]{
              _id, title, "slug": slug.current, excerpt, category,
              author, publishedAt, "imageUrl": mainImage.asset->url
            }
          `),
          client.fetch(`
            *[_type == "magazineIssue"] | order(_createdAt desc)[0...3]{
              _id, title, issue, publishDate, coverImage
            }
          `),
          client.fetch(`
            *[_type == "interview"] | order(publishedAt desc)[0]{
              title, "slug": slug.current, personName, personRole,
              excerpt, "photoUrl": photo.asset->url
            }
          `),
        ]);
        setCoverStory(coverData);
        setLatestArticles(articlesData || []);
        setMagazines(magData || []);
        setLatestInterview(interviewData || null);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const topicCardsData: TopicCardData[] = categories.map((cat, idx) => {
    const sanityMatch =
      latestArticles.find((a) => a.category === cat) ||
      (cat === "Cover Story" && coverStory
        ? { ...coverStory, _id: "cover", category: "Cover Story" }
        : undefined);
    return {
      id: `topic-${idx}`,
      category: cat,
      slug: slugify(cat),
      title: sanityMatch?.title || `Latest from ${cat}`,
      author: sanityMatch?.author || "The Global Doctrine",
      date: sanityMatch
        ? new Date(sanityMatch.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : "",
      image: sanityMatch?.imageUrl || heroImg,
      colorClass: ["Cover Story", "Asia", "Middle East"].includes(cat)
        ? "bg-[hsl(var(--brand-red))]"
        : "bg-primary",
    };
  });

  const editorsPicks = latestArticles.slice(0, 4);

  return (
    <Layout>
      <Helmet>
        <title>The Global Doctrine</title>
        <meta name="description" content="Independent reporting on world conflicts, diplomacy, and global affairs through the lens of ordinary people." />
        <meta property="og:title" content="The Global Doctrine" />
        <meta property="og:description" content="Independent reporting on world conflicts, diplomacy, and global affairs." />
        <meta property="og:url" content="https://theglobaldoctrine.online/" />
        <meta property="og:image" content="https://theglobaldoctrine.online/tgd-cover-final.jpg" />
        <link rel="canonical" href="https://theglobaldoctrine.online/" />
      </Helmet>

      {/* REGIONAL DESK QUICK-BAR */}
      <div className="border-b border-border bg-secondary/60 backdrop-blur-sm">
        <div className="container-editorial flex items-center gap-3 overflow-x-auto no-scrollbar py-2.5 text-xs">
          <span className="inline-flex items-center gap-1.5 shrink-0 font-bold uppercase tracking-[0.18em] text-[hsl(var(--brand-red))] pr-2 border-r border-border">
            <Globe2 className="h-3.5 w-3.5" />
            Desks
          </span>
          <div className="flex items-center gap-1 sm:gap-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/topics/${slugify(cat)}`}
                className="shrink-0 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all duration-200"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* HERO (Same 12-Column Split Layout, Upgraded Framing & Motion) */}
      <section className="border-b border-border relative overflow-hidden">
        <div className="container-editorial py-10 lg:py-16">
          {loading || !coverStory ? (
            <SkeletonCardHero />
          ) : (
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-7"
              >
                <Link
                  to={`/article/${coverStory.slug}`}
                  className="group block relative overflow-hidden border border-border bg-muted shadow-[0_16px_40px_-15px_rgba(0,0,0,0.18)]"
                >
                  <EditorialImage
                    src={coverStory.imageUrl || heroImg}
                    alt={coverStory.title}
                    variant="hero"
                    priority
                  />
                  <div className="pointer-events-none absolute bottom-0 inset-x-0 z-20 flex items-center justify-between bg-gradient-to-t from-black/75 via-black/30 to-transparent px-5 py-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                      Lead Dispatch · Cover Story
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
                      Read Full Analysis <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                variants={heroTextContainer}
                initial="hidden"
                animate="show"
                className="flex flex-col justify-center lg:col-span-5"
              >
                <motion.div variants={heroTextItem} className="flex items-center gap-3 self-start">
                  <span className="inline-flex items-center gap-2 bg-[hsl(var(--brand-red))] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    Cover Story
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Featured Analysis
                  </span>
                </motion.div>

                <motion.h1
                  variants={heroTextItem}
                  className="mt-5 font-serif text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.35rem]"
                >
                  <Link
                    to={`/article/${coverStory.slug}`}
                    className="hover:text-primary transition-colors duration-300"
                  >
                    {coverStory.title}
                  </Link>
                </motion.h1>

                <motion.p
                  variants={heroTextItem}
                  className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg border-l-2 border-[hsl(var(--brand-red))] pl-4"
                >
                  {coverStory.excerpt}
                </motion.p>

                <motion.div
                  variants={heroTextItem}
                  className="mt-6 flex flex-wrap items-center gap-3 text-sm pt-4 border-t border-border"
                >
                  <span className="font-bold uppercase tracking-wider text-xs text-foreground">
                    {coverStory.author}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">
                    {new Date(coverStory.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </motion.div>

                <motion.div variants={heroTextItem} className="mt-7">
                  <Link
                    to={`/article/${coverStory.slug}`}
                    className="group inline-flex items-center gap-2.5 self-start border-b-2 border-primary pb-1.5 text-sm font-bold uppercase tracking-wider text-primary hover:border-[hsl(var(--brand-red))] hover:text-[hsl(var(--brand-red))] transition-all duration-300"
                  >
                    Read the cover story
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* MAGAZINE */}
      <section className="border-b border-border bg-foreground py-16 text-background editorial-dark-grid">
        <div className="container-editorial">
          <div className="mb-10 flex items-end justify-between border-b border-background/20 pb-4">
            <div>
              <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--brand-red))]">
                <BookOpen className="h-4 w-4" />
                Print & Digital Edition
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">The Magazine</h2>
            </div>
            <Link
              to="/magazine"
              className="hidden text-xs font-bold uppercase tracking-widest text-background border border-background/30 px-5 py-2.5 hover:bg-background hover:text-foreground transition-all duration-300 sm:inline-flex items-center gap-2"
            >
              All Releases <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-8 sm:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[4/5] w-full animate-pulse bg-background/20 rounded-sm" />
              ))}
            </div>
          ) : magazines.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid gap-8 sm:grid-cols-3"
            >
              {magazines.map((mag) => (
                <motion.div key={mag._id} variants={fadeUpItem}>
                  <Link to="/magazine" className="group block">
                    <div className="relative overflow-hidden bg-background/10 ring-1 ring-background/15 shadow-[0_15px_35px_rgba(0,0,0,0.45)] transition-all duration-500 group-hover:-translate-y-2 group-hover:ring-primary/60 before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-2 before:bg-gradient-to-r before:from-white/25 before:to-transparent before:z-30">
                      {mag.coverImage && (
                        <EditorialImage
                          src={urlFor(mag.coverImage).auto("format").width(800).url()}
                          alt={`${mag.issue} — ${mag.title}`}
                          variant="portrait"
                        />
                      )}
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[hsl(var(--brand-red))]">
                          {mag.issue}
                        </p>
                        <h3 className="mt-1 font-serif text-xl font-bold group-hover:text-primary transition-colors">
                          {mag.title}
                        </h3>
                        <p className="mt-1 text-xs uppercase tracking-wider text-background/60">
                          {mag.publishDate}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-background/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-sm text-background/60 col-span-3">No magazines published yet.</p>
          )}

          <div className="mt-8 sm:hidden">
            <Link
              to="/magazine"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-background border border-background/30 px-4 py-2.5 hover:bg-background hover:text-foreground transition-all"
            >
              All Releases <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* TOPICS CAROUSEL */}
      <section className="border-b border-border bg-secondary editorial-grid-bg overflow-hidden">
        <div className="container-editorial py-14 lg:py-16 relative">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="kicker text-xs font-bold inline-flex items-center gap-2">
                <span className="h-[2px] w-6 bg-[hsl(var(--brand-red))]" />
                Browse Regional & Thematic Desks
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">All Categories</h2>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs">
              Swipe or use the arrows to explore dispatches across all {categories.length} editorial desks.
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <SkeletonCarouselCard key={i} />
              ))}
            </div>
          ) : (
            <CategoryCarousel topics={topicCardsData} />
          )}
        </div>
      </section>

      {/* EDITOR'S PICKS */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container-editorial">
          <div className="mb-10 flex items-end justify-between border-b-2 border-foreground pb-4">
            <div>
              <p className="kicker text-xs font-bold inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Editor's Picks
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Latest Articles</h2>
            </div>
            <Link
              to="/all-articles"
              className="hidden text-xs font-bold uppercase tracking-widest text-primary border border-primary px-5 py-2.5 hover:bg-primary hover:text-white transition-all duration-300 sm:inline-flex items-center gap-2"
            >
              View All Archive <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonCardCompact key={i} />
              ))}
            </div>
          ) : editorsPicks.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            >
              {editorsPicks.map((a) => (
                <motion.article
                  key={a._id}
                  variants={fadeUpItem}
                  className="group editorial-card flex flex-col overflow-hidden"
                  style={{ borderLeft: "3px solid hsl(var(--brand-red))" }}
                >
                  <Link to={`/article/${a.slug}`} className="block overflow-hidden">
                    <EditorialImage
                      src={a.imageUrl || heroImg}
                      alt={a.title}
                      variant="card"
                    />
                  </Link>
                  <div className="flex flex-col flex-grow p-5">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        to={`/topics/${slugify(a.category)}`}
                        className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-white hover:bg-[hsl(var(--brand-red))] transition-colors"
                      >
                        {a.category}
                      </Link>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <Link to={`/article/${a.slug}`} className="mt-3 block">
                      <h3 className="font-serif text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {a.title}
                      </h3>
                    </Link>
                    <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground line-clamp-2 flex-grow">
                      {a.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground border-t border-border pt-3">
                      <span className="font-semibold text-foreground truncate">{a.author}</span>
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
            <p className="text-muted-foreground col-span-4">No articles published yet.</p>
          )}

          <div className="mt-8 sm:hidden">
            <Link
              to="/all-articles"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary border border-primary px-4 py-2.5 hover:bg-primary hover:text-white transition-all"
            >
              View All Articles <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* INTERVIEW */}
      {!loading && latestInterview && (
        <section className="border-t border-border bg-secondary relative overflow-hidden">
          <div className="container-editorial py-16 lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-10 lg:grid-cols-12 items-center"
            >
              {/* Photo */}
              <div className="lg:col-span-5">
                <Link
                  to={`/interview/${latestInterview.slug}`}
                  className="group block overflow-hidden bg-muted ring-1 ring-border shadow-lg border-l-4 border-[hsl(var(--brand-red))]"
                >
                  <EditorialImage
                    src={latestInterview.photoUrl || heroImg}
                    alt={latestInterview.personName}
                    variant="portrait"
                  />
                </Link>
              </div>

              {/* Content */}
              <div className="relative flex flex-col justify-center lg:col-span-7">
                <span
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute -top-10 -left-4 font-serif text-9xl font-bold leading-none text-primary/10"
                >
                  &ldquo;
                </span>

                <div className="flex items-center gap-3 self-start">
                  <span className="inline-block bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                    The Interview
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    In Conversation
                  </span>
                </div>

                <Link to={`/interview/${latestInterview.slug}`} className="group mt-5 block">
                  <h2 className="font-serif text-3xl font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-4xl lg:text-5xl">
                    &ldquo;{latestInterview.title}&rdquo;
                  </h2>
                </Link>

                {latestInterview.excerpt && (
                  <Link to={`/interview/${latestInterview.slug}`} className="group mt-5 block">
                    <p className="text-base sm:text-lg leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                      {latestInterview.excerpt}
                    </p>
                  </Link>
                )}

                <div className="mt-6 flex items-center gap-3.5 border-l-4 border-[hsl(var(--brand-red))] pl-4 py-0.5">
                  <div>
                    <Link
                      to={`/interview/${latestInterview.slug}`}
                      className="font-bold uppercase tracking-wider text-sm text-foreground transition-colors duration-300 hover:text-primary block"
                    >
                      {latestInterview.personName}
                    </Link>
                    <span className="text-xs sm:text-sm text-muted-foreground italic">
                      {latestInterview.personRole}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/interview/${latestInterview.slug}`}
                  className="group mt-8 inline-flex items-center gap-2 self-start border-b-2 border-primary pb-1 text-sm font-bold uppercase tracking-wider text-primary transition-all duration-300 hover:border-[hsl(var(--brand-red))] hover:text-[hsl(var(--brand-red))]"
                >
                  Read the interview
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* THE DOCTRINE BRIEF FORM */}
      <DoctrineBrief />
    </Layout>
  );
};

export default Index;
