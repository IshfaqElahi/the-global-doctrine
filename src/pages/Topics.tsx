import { useParams, Navigate, useState } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ArticleCard } from "@/components/ArticleCard";
import { TrendingSidebar } from "@/components/Sidebar";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { articles, categories } from "@/data/articles";

const slugify = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

const Topics = () => {
  const { category } = useParams();
  const cat = categories.find((c) => slugify(c) === category);
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>(cat || "Cover Story");
  
  if (!cat) return <Navigate to="/" replace />;
  const list = articles.filter((a) => a.category === cat);
  const display = list.length ? list : articles;

  return (
    <Layout>
      <section className="border-b border-border bg-secondary">
        <div className="container-editorial py-12 lg:py-16">
          <p className="kicker">Topic</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{cat}</h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Reporting, analysis, and long-form commentary from across the {cat.toLowerCase()} desk.
          </p>

          {/* Category Carousel */}
          <div className="mt-8 flex px-4 sm:px-0">
            <CategoryCarousel
              categories={categories}
              onCategoryChange={(newCategory) => {
                setSelectedCategory(newCategory);
                // Navigate to the new category
                window.location.href = `/topics/${slugify(newCategory)}`;
              }}
              defaultCategory={cat}
              showArrows={true}
              pauseOnHover={true}
            />
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
