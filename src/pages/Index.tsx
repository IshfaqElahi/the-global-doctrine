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

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import { CategoryCarousel, TopicCardData } from "@/components/CategoryCarousel";
import { SkeletonCardHero, SkeletonCardCompact, SkeletonCarouselCard } from "@/components/SkeletonCard";
import { DoctrineBrief } from "@/components/DoctrineBrief";
import { categories } from "@/data/articles";
import { client, urlFor } from "@/lib/sanity";
import heroImg from "@/assets/hero-summit.jpg";

const slugify = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [coverStory, setCoverStory] = useState<CoverStory | null>(null);
  const [latestArticles, setLatestArticles] = useState<SanityArticle[]>([]);
  const [magazines, setMagazines] = useState<MagazineIssue[]>([]);
  const [latestInterview, setLatestInterview] = useState<LatestInterview | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
            *[_type == "magazineIssue"] | order(publishedAt desc)[0...3]{
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
    const sanityMatch = latestArticles.find((a) => a.category === cat);
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

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

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

      {/* HERO */}
      <section className="border-b border-border">
        <div className="container-editorial py-10 lg:py-16">
          {loading || !coverStory ? (
            <SkeletonCardHero />
          ) : (
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <Link to={`/article/${coverStory.slug}`} className="group block lg:col-span-7">
                <div className="overflow-hidden bg-muted w-full">
                  <img
                    src={coverStory.imageUrl}
                    alt={coverStory.title}
                    width={1600}
                    height={1024}
                    className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
              </Link>
              <div className="flex flex-col justify-center lg:col-span-5">
                <span className="inline-block self-start bg-[hsl(var(--brand-red))] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  Cover Story
                </span>
                <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  <Link to={`/article/${coverStory.slug}`} className="hover:text-primary transition-colors">
                    {coverStory.title}
                  </Link>
                </h1>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{coverStory.excerpt}</p>
                <div className="mt-6 flex items-center gap-3 text-sm">
                  <span className="font-semibold text-foreground">{coverStory.author}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span className="text-muted-foreground">
                    {new Date(coverStory.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
                <Link to={`/article/${coverStory.slug}`}
                  className="mt-6 inline-flex items-center gap-2 self-start border-b-2 border-primary pb-1 text-sm font-bold uppercase tracking-wider text-primary hover:gap-3 transition-all duration-300">
                  Read the cover story <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MAGAZINE */}
      <section className="border-b border-border bg-foreground py-14 text-background">
        <div className="container-editorial">
          <div className="mb-10 flex items-end justify-between border-b border-background/20 pb-3">
            <div>
              <p className="text-base font-bold uppercase tracking-[0.2em] text-[hsl(var(--brand-red))]">Print & digital</p>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">The Magazine</h2>
            </div>
            <Link to="/magazine"
              className="hidden text-sm font-semibold text-background border border-background/30 px-4 py-2 hover:bg-white hover:text-black transition-all duration-300 sm:inline">
              All Releases →
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[4/5] w-full animate-pulse bg-background/20 rounded-sm" />
              ))
            ) : magazines.length > 0 ? (
              magazines.map((mag) => (
                <Link key={mag._id} to="/magazine" className="group block">
                  <div className="overflow-hidden bg-background/10 ring-1 ring-background/10">
                    {mag.coverImage && (
                      <img src={urlFor(mag.coverImage).url()} alt={`${mag.issue} — ${mag.title}`} loading="lazy"
                        className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-bold">{mag.issue} — {mag.title}</h3>
                  <p className="text-sm text-background/60">{mag.publishDate}</p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-background/60 col-span-3">No magazines published yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* TOPICS CAROUSEL */}
      <section className="border-b border-border bg-secondary overflow-hidden">
        <div className="container-editorial py-12 lg:py-16 relative">
          <div className="mb-8">
            <p className="kicker text-sm font-bold">Browse topics</p>
            <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">All Categories</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => <SkeletonCarouselCard key={i} />)}
            </div>
          ) : (
            <CategoryCarousel topics={topicCardsData} />
          )}
        </div>
      </section>

      {/* EDITOR'S PICKS */}
      <section className="py-16 bg-background">
        <div className="container-editorial">
          <div className="mb-8 flex items-end justify-between border-b-2 border-foreground pb-3">
            <div>
              <p className="kicker text-sm font-bold">Editor's picks</p>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Latest Articles</h2>
            </div>
            <Link to="/all-articles"
              className="hidden text-sm font-bold text-primary border border-primary px-4 py-2 hover:bg-primary hover:text-white transition-all duration-300 sm:inline">
              View all →
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {loading
              ? [...Array(4)].map((_, i) => <SkeletonCardCompact key={i} />)
              : editorsPicks.length > 0
                ? editorsPicks.map((a) => (
                  <article key={a._id} className="group bg-background border border-border shadow-md hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/50 transition-all duration-300" style={{ borderLeft: "3px solid hsl(var(--brand-red))" }}>
                    <Link to={`/article/${a.slug}`} className="block overflow-hidden">
                      <img src={a.imageUrl} alt={a.title} loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </Link>
                    <div className="p-4">
                      <Link to={`/topics/${slugify(a.category)}`}
                        className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-white">
                        {a.category}
                      </Link>
                      <Link to={`/article/${a.slug}`}>
                        <h3 className="mt-2 font-serif text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {a.title}
                        </h3>
                      </Link>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{a.excerpt}</p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground border-t border-border pt-3">
                        <span className="font-semibold text-foreground">{a.author}</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                        <span>{new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                    </div>
                  </article>
                ))
                : <p className="text-muted-foreground col-span-4">No articles published yet.</p>
            }
          </div>
        </div>
      </section>

      {/* INTERVIEW */}
      {!loading && latestInterview && (
        <section className="border-t border-border bg-secondary">
          <div className="container-editorial py-16">
            <div className="grid gap-10 lg:grid-cols-12">

              {/* Photo */}
              <div className="lg:col-span-5">
                <Link to={`/interview/${latestInterview.slug}`} className="group block overflow-hidden bg-muted ring-1 ring-border">
                  <img
                    src={latestInterview.photoUrl}
                    alt={latestInterview.personName}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center lg:col-span-7">

                {/* Blue filled kicker */}
                <span className="inline-block self-start bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  The Interview
                </span>

                <Link to={`/interview/${latestInterview.slug}`} className="group mt-4 block">
                  <h2 className="font-serif text-3xl font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-4xl lg:text-5xl">
                    "{latestInterview.title}"
                  </h2>
                </Link>

                {latestInterview.excerpt && (
                  <Link to={`/interview/${latestInterview.slug}`} className="group mt-5 block">
                    <p className="text-lg leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-primary/80">
                      {latestInterview.excerpt}
                    </p>
                  </Link>
                )}

                <div className="mt-6 flex items-center gap-3 text-sm">
                  <Link
                    to={`/interview/${latestInterview.slug}`}
                    className="font-semibold text-foreground transition-colors duration-300 hover:text-primary"
                  >
                    {latestInterview.personName}
                  </Link>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span className="text-muted-foreground">{latestInterview.personRole}</span>
                </div>

                <Link
                  to={`/interview/${latestInterview.slug}`}
                  className="mt-6 inline-flex items-center gap-2 self-start border-b-2 border-primary pb-1 text-sm font-bold uppercase tracking-wider text-primary transition-all duration-300 hover:gap-3 hover:border-[hsl(var(--brand-red))] hover:text-[hsl(var(--brand-red))]"
                >
                  Read the interview <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* THE DOCTRINE BRIEF FORM */}
      <DoctrineBrief />

    </Layout>
  );
};

export default Index;