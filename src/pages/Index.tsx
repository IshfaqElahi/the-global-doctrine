import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryCarousel, TopicCardData } from "@/components/CategoryCarousel";
import { Newsletter } from "@/components/Newsletter";
import { articles, categories } from "@/data/articles";
import heroImg from "@/assets/hero-summit.jpg";
import interview1 from "@/assets/interview-1.jpg";

// Only importing the single magazine cover
import magGlobalDoctrine from "@/assets/magazine-global-doctrine-1.jpg";

const Index = () => {
  const featured = articles[0];
  const latest = articles.slice(1, 5);
  const moreByCategory = ["Europe", "Asia", "Middle East"] as const;

  // Map categories to full cards for the new Swiper Carousel
  const topicCardsData: TopicCardData[] = categories.map((cat, idx) => {
    // Find the most recent article for this category to feature on the card
    const categoryArticle = articles.find((a) => a.category === cat) || articles[0];
    
    return {
      id: `topic-${idx}`,
      category: cat,
      slug: cat.toLowerCase().replace(/\s+/g, "-"),
      title: categoryArticle.title,
      excerpt: categoryArticle.excerpt,
      author: categoryArticle.author,
      date: categoryArticle.date,
      // Using type 'any' fallback just in case image isn't defined in articles.ts yet
      image: categoryArticle.image || heroImg, 
      // Apply the Global Doctrine Red to specific tags, Blue to others
      colorClass: ["Cover Story", "Asia", "Middle East"].includes(cat) 
        ? "bg-[hsl(var(--brand-red))]" 
        : "bg-primary",
    };
  });

  return (
    <Layout>
      {/* HERO */}
      <section className="border-b border-border">
        <div className="container-editorial py-10 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <Link to={`/article/${featured.slug}`} className="group block lg:col-span-7">
              <div className="overflow-hidden bg-muted">
                <img src={heroImg} alt={featured.title} width={1600} height={1024} className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
              </div>
            </Link>
            <div className="flex flex-col justify-center lg:col-span-5">
              <span className="inline-block self-start bg-[hsl(var(--brand-red))] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red-foreground">
                Cover Story
              </span>
              <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                <Link to={`/article/${featured.slug}`} className="hover:text-primary transition-colors">
                  {featured.title}
                </Link>
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {featured.excerpt}
              </p>
              <div className="mt-6 flex items-center gap-3 text-sm">
                <span className="font-semibold text-foreground">{featured.author}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">{featured.date}</span>
              </div>
              <Link to={`/article/${featured.slug}`} className="mt-6 inline-flex items-center gap-2 self-start border-b-2 border-primary pb-1 text-sm font-bold uppercase tracking-wider text-primary">
                Read the cover story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TOPICS CAROUSEL (NEW SWIPER IMPLEMENTATION) */}
      <section className="border-b border-border bg-secondary overflow-hidden">
        <div className="container-editorial py-12 lg:py-16 relative">
          <div className="mb-8">
            <p className="kicker text-sm font-bold">Browse topics</p>
            <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">All Categories</h2>
          </div>
          
          <CategoryCarousel topics={topicCardsData} />
          
        </div>
      </section>

      {/* LATEST */}
      <section className="container-editorial py-16">
        <div className="mb-8 flex items-end justify-between border-b-2 border-foreground pb-3">
          <div>
            <p className="kicker text-sm font-bold">Editor's picks</p>
            <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Latest Articles</h2>
          </div>
          <Link to="/topics/international" className="hidden text-sm font-semibold text-primary hover:underline sm:inline">View all →</Link>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {latest.map((a) => (
            <ArticleCard key={a.slug} article={a} variant="compact" />
          ))}
        </div>
      </section>

      {/* CATEGORY HIGHLIGHTS */}
      <section className="border-y border-border bg-secondary py-16">
        <div className="container-editorial">
          <div className="mb-10">
            <p className="kicker-blue">By region</p>
            <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Category Highlights</h2>
          </div>
          <div className="grid gap-10 lg:grid-cols-3">
            {moreByCategory.map((cat) => {
              const a = articles.find((ar) => ar.category === cat);
              if (!a) return null;
              return (
                <div key={cat} className="border-t-2 border-foreground pt-5">
                  <Link to={`/topics/${cat.toLowerCase().replace(/\s+/g, "-")}`} className="kicker-blue">{cat}</Link>
                  <ArticleCard article={a} variant="compact" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERVIEW */}
      <section className="container-editorial py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="overflow-hidden bg-muted">
              <img src={interview1} alt="Featured interview" loading="lazy" className="aspect-[4/5] w-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="kicker">The Interview</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              "Diplomacy is the art of postponing certainty."
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Ambassador Henrik Aaland on three decades at the negotiating table, the disappearance of the back channel, and what young diplomats should be reading.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Interview by Layla Haddad</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>20 min read</span>
            </div>
            <Link to="/interview" className="mt-6 inline-flex items-center gap-2 self-start border-b-2 border-[hsl(var(--brand-red))] pb-1 text-sm font-bold uppercase tracking-wider text-[hsl(var(--brand-red))]">
              Read the interview <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* MAGAZINE PREVIEW */}
      <section className="border-y border-border bg-foreground py-16 text-background">
        <div className="container-editorial">
          <div className="mb-10 flex items-end justify-between border-b border-background/30 pb-3">
            <div>
              <p className="text-base font-bold uppercase tracking-[0.2em] text-[hsl(var(--brand-red))]">Print & digital</p>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">The Magazine</h2>
            </div>
            <Link to="/magazine" className="hidden text-sm font-semibold text-background hover:bg-white hover:text-black hover:-translate-y-1 transition-all duration-300 px-3 py-1 rounded-md sm:inline">Releases</Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { src: magGlobalDoctrine, title: "1st Edition — The Global Doctrine", date: "March 2026" },
            ].map((m) => (
              <Link key={m.title} to="/magazine" className="group block">
                <div className="overflow-hidden bg-background/10">
                  <img src={m.src} alt={m.title} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold">{m.title}</h3>
                <p className="text-sm text-background/60">{m.date}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div id="newsletter">
        <Newsletter />
      </div>
    </Layout>
  );
};

export default Index;