import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/data/articles";
import { cn } from "@/lib/utils";

const slug = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

export const ArticleCard = ({ article, variant = "default" }: { article: Article; variant?: "default" | "compact" | "horizontal" }) => {
  const isUrgent = article.category === "Cover Story" || article.category === "Middle East";
  const tagClass = isUrgent
    ? "bg-[hsl(var(--brand-red))] text-brand-red-foreground"
    : "bg-primary text-primary-foreground";

  if (variant === "horizontal") {
    return (
      <article className="group grid grid-cols-[1fr_2fr] gap-4">
        <Link to={`/article/${article.slug}`} className="overflow-hidden bg-muted">
          <img src={article.image} alt={article.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="flex flex-col">
          <Link to={`/topics/${slug(article.category)}`} className="kicker mb-1.5">{article.category}</Link>
          <Link to={`/article/${article.slug}`}>
            <h3 className="article-title text-base sm:text-lg">{article.title}</h3>
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">{article.author} · {article.date}</p>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group">
        <Link to={`/article/${article.slug}`} className="block overflow-hidden bg-muted">
          <img src={article.image} alt={article.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="pt-3">
          <span className={cn("inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", tagClass)}>{article.category}</span>
          <Link to={`/article/${article.slug}`}>
            <h3 className="article-title mt-2 text-lg">{article.title}</h3>
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">{article.author} · {article.date}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col">
      <Link to={`/article/${article.slug}`} className="block overflow-hidden bg-muted">
        <img src={article.image} alt={article.title} loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <Link to={`/topics/${slug(article.category)}`} className={cn("inline-block self-start px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", tagClass)}>
          {article.category}
        </Link>
        <Link to={`/article/${article.slug}`}>
          <h3 className="article-title mt-3 text-xl sm:text-2xl">{article.title}</h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>{article.author} · {article.date}</span>
          <Link to={`/article/${article.slug}`} className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
            Read <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
