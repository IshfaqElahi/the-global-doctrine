import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ArticleCard } from "@/components/ArticleCard";
import { TrendingSidebar } from "@/components/Sidebar";
import { articles, categories } from "@/data/articles";

const slugify = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

const Topics = () => {
  const { category } = useParams();
  const cat = categories.find((c) => slugify(c) === category);
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
          <nav className="mt-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c}
                to={`/topics/${slugify(c)}`}
                className={`border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  c === cat ? "border-foreground bg-foreground text-background" : "border-border bg-background hover:border-foreground"
                }`}
              >
                {c}
              </Link>
            ))}
          </nav>
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
