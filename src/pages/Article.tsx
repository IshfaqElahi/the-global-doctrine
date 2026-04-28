import { useParams, Navigate, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { TrendingSidebar } from "@/components/Sidebar";
import { articles, articleBody } from "@/data/articles";

const slugify = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

const Article = () => {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return <Navigate to="/" replace />;

  return (
    <Layout>
      <article>
        <div className="border-b border-border">
          <div className="container-editorial py-10 lg:py-14">
            <div className="mx-auto max-w-3xl">
              <Link to={`/topics/${slugify(article.category)}`} className="kicker">{article.category}</Link>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
                {article.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">{article.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-semibold text-foreground">By {article.author}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">{article.date}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">9 min read</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container-editorial">
          <div className="-mt-px overflow-hidden bg-muted">
            <img src={article.image} alt={article.title} className="aspect-[16/9] w-full object-cover hover:shadow-lg transition-shadow duration-500" />
          </div>
        </div>

        <div className="container-editorial py-12">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="mx-auto max-w-2xl space-y-6 text-lg leading-[1.75] text-foreground/90">
                {articleBody.split("\n\n").map((p, i) => (
                  <p key={i} className={i === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-[hsl(var(--brand-red))]" : ""}>
                    {p}
                  </p>
                ))}
                <blockquote className="border-l-4 border-[hsl(var(--brand-red))] pl-6 font-serif text-2xl italic leading-snug text-foreground">
                  "We are negotiating in a world that has not yet decided what it wants to be."
                </blockquote>
                <p>{articleBody.split("\n\n")[0]}</p>
              </div>
            </div>
            <div className="lg:col-span-4">
              <TrendingSidebar />
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default Article;
