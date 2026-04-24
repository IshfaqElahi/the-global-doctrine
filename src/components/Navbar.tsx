import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, X, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { categories } from "@/data/articles";
import { cn } from "@/lib/utils";

const topicSlug = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); setSearchOpen(false); }, [location.pathname]);

  const navLink = (to: string, label: string) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={cn(
          "text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary",
          active ? "text-primary" : "text-foreground"
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Top strip */}
      <div className="hidden border-b border-border bg-secondary md:block">
        <div className="container-editorial flex h-8 items-center justify-between text-xs text-muted-foreground">
          <span className="uppercase tracking-[0.2em]">Independent · Geopolitical · Since 2024</span>
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>

      <div className="container-editorial flex h-20 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {navLink("/", "Home")}
          {/* Topics dropdown */}
          <div className="group relative">
            <button className="inline-flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-foreground transition-colors hover:text-primary">
              Topics <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 mt-0 w-56 -translate-x-1/2 border border-border bg-popover opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              <div className="h-1 w-full bg-[hsl(var(--brand-red))]" />
              <ul className="py-2">
                {categories.map((c) => (
                  <li key={c}>
                    <Link to={`/topics/${topicSlug(c)}`} className="block px-4 py-2 text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-primary">
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {navLink("/interview", "Interview")}
          {/* About dropdown */}
          <div className="group relative">
            <button className="inline-flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-foreground transition-colors hover:text-primary">
              About Us <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 mt-0 w-48 -translate-x-1/2 border border-border bg-popover opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              <div className="h-1 w-full bg-[hsl(var(--brand-red))]" />
              <ul className="py-2">
                <li><Link to="/about/who-we-are" className="block px-4 py-2 text-sm hover:bg-accent hover:text-primary">Who We Are</Link></li>
                <li><Link to="/about/policy" className="block px-4 py-2 text-sm hover:bg-accent hover:text-primary">Policy</Link></li>
              </ul>
            </div>
          </div>
          {navLink("/magazine", "Magazine")}
          {navLink("/social", "Social Media")}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => setSearchOpen((v) => !v)} aria-label="Search" className="rounded p-2 transition-colors hover:bg-accent">
            <Search className="h-4 w-4" />
          </button>
          <button onClick={() => setOpen((v) => !v)} aria-label="Menu" className="rounded p-2 transition-colors hover:bg-accent lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-background">
          <div className="container-editorial py-4">
            <div className="flex items-center gap-3 border-b-2 border-foreground py-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                autoFocus
                type="search"
                placeholder="Search articles, interviews, regions…"
                className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-editorial flex flex-col py-4">
            {[
              ["/", "Home"],
              ["/interview", "Interview"],
              ["/magazine", "Magazine"],
              ["/social", "Social Media"],
              ["/about/who-we-are", "Who We Are"],
              ["/about/policy", "Policy"],
            ].map(([to, label]) => (
              <Link key={to} to={to} className="border-b border-border py-3 text-sm font-medium uppercase tracking-wide hover:text-primary">
                {label}
              </Link>
            ))}
            <div className="py-3">
              <p className="kicker mb-2">Topics</p>
              <div className="grid grid-cols-2 gap-y-2">
                {categories.map((c) => (
                  <Link key={c} to={`/topics/${topicSlug(c)}`} className="text-sm hover:text-primary">{c}</Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
