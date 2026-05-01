import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, X, ChevronDown, Sun, Moon } from "lucide-react";
import { Logo } from "./Logo";
import { categories } from "@/data/articles";
import { cn } from "@/lib/utils";
// FIX: Updated this import to point to the correct Context file we built
import { useTheme } from "@/context/ThemeContext";

const topicSlug = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
const navigate = useNavigate();

const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter" && searchQuery.trim()) {
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  }
};

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
          <span className="uppercase tracking-[0.2em]">Independent · Geopolitical · Since 2026</span>
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
          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="rounded p-2 transition-colors hover:bg-accent"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button onClick={() => setSearchOpen((v) => !v)} aria-label="Search" className="rounded p-2 transition-colors hover:bg-accent">
            <Search className="h-4 w-4" />
          </button>
          <button onClick={() => setOpen((v) => !v)} aria-label="Menu" className={cn("rounded p-2 transition-colors hover:bg-accent lg:hidden burger-menu", open ? "open" : "closed")}>
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
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={handleSearch}
  placeholder="Search articles, interviews, regions… (press Enter)"
  className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
/>
            </div>
          </div>
        </div>
      )}

      {open && (
  <div
    className="fixed inset-0 z-40 lg:hidden"
    style={{ animation: "fadeIn 0.2s ease" }}
  >
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

    {/* Slide-in panel from right */}
    <nav
      className="absolute right-0 top-0 bottom-0 w-80 bg-background border-l border-border flex flex-col py-6 px-6 overflow-y-auto"
      style={{ animation: "slideInRight 0.25s ease" }}
    >
      <button onClick={() => setOpen(false)} className="self-end mb-6 rounded p-2 hover:bg-accent">
        <X className="h-5 w-5" />
      </button>
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