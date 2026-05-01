import { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, Search, X, ChevronDown, Sun, Moon } from "lucide-react";
import { Logo } from "./Logo";
import { categories } from "@/data/articles";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

const topicSlug = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLink = (to: string, label: string) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={cn(
          "text-sm font-medium uppercase tracking-wide transition-all duration-300",
          active 
            ? "text-primary [text-shadow:0_0_12px_hsl(var(--primary)/0.6)]" 
            : "text-background hover:text-primary hover:[text-shadow:0_0_12px_hsl(var(--primary)/0.6)]"
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      {/* Inverted Logic: bg-foreground makes it Dark in Light Mode, White in Dark Mode */}
      <header className="sticky top-0 z-50 border-b border-background/10 bg-foreground/70 backdrop-blur-lg transition-colors duration-400">

        {/* Top strip */}
        <div className="hidden border-b border-background/20 md:block">
          <div className="container-editorial flex h-8 items-center justify-between text-xs text-background/60">
            <span className="uppercase tracking-[0.2em]">Independent · Geopolitical · Since 2024</span>
            <span>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>

        <div className="container-editorial flex h-20 items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="group inline-flex items-center gap-2" aria-label="The Global Doctrine — Home">
            <img src="/logo.svg" alt="The Global Doctrine Logo" className="h-10 w-10 object-contain" />
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight transition-all duration-300 group-hover:[text-shadow:0_0_12px_hsl(var(--primary)/0.3)]">
              {/* Text is text-background to contrast the inverted navbar */}
              <span className="text-background transition-colors group-hover:text-primary">The Global </span>
              <span className="text-[hsl(var(--brand-red))]">Doctrine</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navLink("/", "Home")}

            {/* Topics dropdown */}
            <div className="group relative">
              <button className="inline-flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-background transition-all duration-300 hover:text-primary hover:[text-shadow:0_0_12px_hsl(var(--primary)/0.6)]">
                Topics <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 mt-0 w-56 -translate-x-1/2 border border-border bg-popover opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                <div className="h-1 w-full bg-[hsl(var(--brand-red))]" />
                <ul className="py-2">
                  {categories.map((c) => (
                    <li key={c}>
                      <Link
                        to={`/topics/${topicSlug(c)}`}
                        className="block px-4 py-2 text-sm text-popover-foreground transition-all duration-300 hover:bg-accent hover:text-primary hover:[text-shadow:0_0_8px_hsl(var(--primary)/0.4)]"
                      >
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
              <button className="inline-flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-background transition-all duration-300 hover:text-primary hover:[text-shadow:0_0_12px_hsl(var(--primary)/0.6)]">
                About Us <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 mt-0 w-48 -translate-x-1/2 border border-border bg-popover opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                <div className="h-1 w-full bg-[hsl(var(--brand-red))]" />
                <ul className="py-2">
                  <li><Link to="/about/who-we-are" className="block px-4 py-2 text-sm text-popover-foreground transition-all duration-300 hover:bg-accent hover:text-primary hover:[text-shadow:0_0_8px_hsl(var(--primary)/0.4)]">Who We Are</Link></li>
                  <li><Link to="/about/policy" className="block px-4 py-2 text-sm text-popover-foreground transition-all duration-300 hover:bg-accent hover:text-primary hover:[text-shadow:0_0_8px_hsl(var(--primary)/0.4)]">Policy</Link></li>
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
              className="rounded p-2 text-background transition-all duration-300 hover:bg-background/10 hover:text-primary hover:[text-shadow:0_0_12px_hsl(var(--primary)/0.6)]"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Search */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="rounded p-2 text-background transition-all duration-300 hover:bg-background/10 hover:text-primary hover:[text-shadow:0_0_12px_hsl(var(--primary)/0.6)]"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Burger */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="rounded p-2 text-background transition-all duration-300 hover:bg-background/10 hover:text-primary lg:hidden"
            >
              <span
                className="block transition-transform duration-300"
                style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </span>
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-background/20 bg-foreground/70 backdrop-blur-lg">
            <div className="container-editorial py-4">
              <div className="flex items-center gap-3 border-b-2 border-background/30 py-2 transition-all focus-within:border-primary focus-within:[box-shadow:0_2px_10px_-2px_hsl(var(--primary)/0.4)]">
                <Search className="h-5 w-5 text-background/50" />
                <input
                  autoFocus
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search articles, interviews, regions… (press Enter)"
                  className="w-full bg-transparent text-base text-background outline-none placeholder:text-background/40"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu - Keeps standard theme (not inverted) for readability on full screen */}
      {open && (
        <div className="fixed inset-0 z-[9998] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            style={{ animation: "fadeIn 0.2s ease forwards" }}
            onClick={() => setOpen(false)}
          />

          {/* Slide-in panel */}
          <nav
            ref={panelRef}
            className="absolute right-0 top-0 bottom-0 w-[min(320px,85vw)] bg-background border-l border-border flex flex-col overflow-y-auto"
            style={{ animation: "slideInRight 0.25s cubic-bezier(0.4,0,0.2,1) forwards" }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <span className="font-serif text-lg font-bold text-foreground">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-2 hover:bg-accent transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-col px-6 py-4">
              {[
                ["/", "Home"],
                ["/interview", "Interview"],
                ["/magazine", "Magazine"],
                ["/all-articles", "All Articles"],
                ["/social", "Social Media"],
                ["/about/who-we-are", "Who We Are"],
                ["/about/policy", "Policy"],
              ].map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "border-b border-border py-3.5 text-sm font-semibold uppercase tracking-wide transition-all duration-300",
                    location.pathname === to 
                      ? "text-primary [text-shadow:0_0_12px_hsl(var(--primary)/0.6)]" 
                      : "text-foreground hover:text-primary hover:[text-shadow:0_0_12px_hsl(var(--primary)/0.6)]"
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Topics */}
            <div className="px-6 py-4 border-t border-border">
              <p className="kicker mb-4">Topics</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {categories.map((c) => (
                  <Link
                    key={c}
                    to={`/topics/${topicSlug(c)}`}
                    className="text-sm text-foreground transition-all duration-300 hover:text-primary hover:[text-shadow:0_0_8px_hsl(var(--primary)/0.4)]"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>

            {/* Dark mode toggle inside panel */}
            <div className="mt-auto border-t border-border px-6 py-5">
              <button
                onClick={toggle}
                className="flex w-full items-center justify-between rounded border border-border px-4 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:bg-accent hover:text-primary hover:[text-shadow:0_0_12px_hsl(var(--primary)/0.6)]"
              >
                <span>{theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};