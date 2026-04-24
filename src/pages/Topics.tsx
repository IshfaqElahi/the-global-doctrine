import { useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ArticleCard } from "@/components/ArticleCard";
import { TrendingSidebar } from "@/components/Sidebar";
import { CategoryCarousel, TopicCardData } from "@/components/CategoryCarousel";
import { articles, categories } from "@/data/articles";
import heroImg from "@/assets/hero-summit.jpg"; // Fallback image

const slugify = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

const Topics = () => {
  const { category } = useParams();
  const cat = categories.find((c) => slugify(c) === category);
  
  // If no matching category is found in the URL, redirect home
  if (!cat) return <Navigate to="/" replace />;
  
  const list = articles.filter((a) => a.category === cat);
  const display = list.length ? list : articles;

  // Map categories to full cards for the Swiper Carousel
  const topicCardsData: TopicCardData[] = categories.map((c, idx) => {
    const categoryArticle = articles.find((a) => a.category === c) || articles[0];
    return {
      id: `topic-${idx}`,
      category: c,
      slug: slugify(c),
      title: categoryArticle.title,
      excerpt: categoryArticle.excerpt,
      author: categoryArticle.author,
      date: categoryArticle.date,
      // Using type 'any' fallback just in case image isn't defined
      image: categoryArticle.image || heroImg, 
      colorClass: ["Cover Story", "Asia", "Middle East"].includes(c) 
        ? "bg-[hsl(var(--brand-red))]" 
        : "bg-primary",
    };
  });

  return (
    <Layout>
      <section className="border-b border-border bg-secondary">
        <div className="container-editorial py-12 lg:py-16">
          <p className="kicker">Topic</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{cat}</h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Reporting, analysis, and long-form commentary from across the {cat.toLowerCase()} desk.
          </p>

          {/* New Animated Category Carousel */}
          <div className="mt-12 -mx-4 sm:mx-0">
            <CategoryCarousel topics={topicCardsData} />
          </div>
        </div>
      </section>

      <section className="container-editorial py-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="grid gap-10 sm:grid-cols-2">
              {display.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="compact" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <TrendingSidebar />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Topics;