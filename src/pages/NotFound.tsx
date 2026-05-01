import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ArrowRight } from "lucide-react";

const NotFound = () => (
  <Layout>
    <section className="container-editorial flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      {/* Big 404 */}
      <div className="relative mb-6">
        <span className="font-serif text-[10rem] font-black leading-none text-border sm:text-[14rem]">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-[10rem] font-black leading-none text-foreground/5 sm:text-[14rem]">
            404
          </span>
        </div>
      </div>

      {/* Red rule */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-[2px] w-12 bg-[hsl(var(--brand-red))]" />
        <p className="kicker">Page Not Found</p>
        <div className="h-[2px] w-12 bg-[hsl(var(--brand-red))]" />
      </div>

      <h1 className="font-serif text-3xl font-bold sm:text-4xl">
        This page has gone off the record.
      </h1>
      <p className="mt-4 max-w-md text-base text-muted-foreground">
        The page you're looking for may have been moved, deleted, or never existed. Try heading back to the homepage.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-foreground px-6 py-3 text-sm font-bold uppercase tracking-widest text-background transition-all hover:bg-[hsl(var(--brand-red))]"
        >
          Back to Homepage <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/all-articles"
          className="inline-flex items-center gap-2 border border-border px-6 py-3 text-sm font-bold uppercase tracking-widest text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background"
        >
          Browse Articles
        </Link>
      </div>

      {/* Quick links */}
      <div className="mt-16 border-t border-border pt-10">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          You might be looking for
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            ["/", "Home"],
            ["/interview", "Interview"],
            ["/magazine", "Magazine"],
            ["/topics/international", "International"],
            ["/topics/middle-east", "Middle East"],
            ["/topics/asia", "Asia"],
            ["/about/who-we-are", "About Us"],
          ].map(([to, label]) => (
            <Link
              key={to}
              to={to}
              className="border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default NotFound;