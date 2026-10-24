import { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, Search, X, ChevronDown, Sun, Moon, ArrowUpRight, Globe } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { categories } from "@/data/articles";
import { client } from "@/lib/sanity";
import { cleanText } from "@/lib/editorialText";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

const topicSlug = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [tickerItems, setTickerItems] = useState<{ title: string; slug: string; category: string }[]>([]);
  const [tickerIndex, setTickerIndex] = useState(0);
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    } else if (e.key === "Escape") {
      setSearchOpen(false);
    }
  };

  const navLink = (to: string, label: string) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={cn(
          "relative py-1 text-sm font-medium uppercase tracking-wide transition-all duration-300",
          active
            ? "text-primary [text-shadow:0_0_12px_hsl(var(--primary)/0.6)]"
            : "text-background/90 hover:text-primary hover:[text-shadow:0_0_12px_hsl(var(--primary)/0.6)]"
        )}
      >
        {label}
        {active && (
          <motion.span
            layoutId="navbar-active-indicator"
            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[hsl(var(--brand-red))]"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  const isTopicsActive = location.pathname.startsWith("/topics/");
  const isAboutActive = location.pathname.startsWith("/about/");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-background/10 bg-foreground/85 dark:bg-foreground/95 backdrop-blur-xl transition-all duration-300",
          scrolled && "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)]"
        )}
      >
        {/* Top Geopolitical Dateline Strip */}
        <div className="hidden border-b border-background/15 md:block">
          <div className="container-editorial flex h-8 items-center justify-between text-[11px] text-background/70">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--brand-red))] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--brand-red))]" />
              </span>
              <span className="uppercase tracking-[0.2em] font-medium">
                Independent · Geopolitical · Since 2026
              </span>
            </div>
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-1.5 text-background/60">
                <Globe className="h-3 w-3 text-primary" />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="h-3 w-[1px] bg-background/20" />
              <Link
                to="/all-articles"
                className="uppercase tracking-widest text-[10px] font-bold text-background/80 hover:text-primary transition-colors"
              >
                Archive
              </Link>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "container-editorial flex items-center justify-between gap-4 transition-all duration-300",
            scrolled ? "h-16" : "h-20"
          )}
        >
          {/* Logo */}
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5"
            aria-label="The Global Doctrine — Home"
          >
            <img
              src="/logo.svg"
              alt="The Global Doctrine Logo"
              className="h-10 w-10 object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight transition-all duration-300 group-hover:[text-shadow:0_0_12px_hsl(var(--primary)/0.3)]">
              <span className="text-background transition-colors group-hover:text-primary">
                The Global{" "}
              </span>
              <span className="text-[hsl(var(--brand-red))]">Doctrine</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navLink("/", "Home")}

            {/* Topics dropdown */}
            <div className="group relative py-2">
              <button
                className={cn(
                  "relative inline-flex items-center gap-1 text-sm font-medium uppercase tracking-wide transition-all duration-300",
                  isTopicsActive
                    ? "text-primary [text-shadow:0_0_12px_hsl(var(--primary)/0.6)]"
                    : "text-background/90 hover:text-primary hover:[text-shadow:0_0_12px_hsl(var(--primary)/0.6)]"
                )}
              >
                Topics{" "}
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                {isTopicsActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[hsl(var(--brand-red))]"
                  />
                )}
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 translate-y-2 border border-border bg-popover opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="h-1 w-full bg-[hsl(var(--brand-red))]" />
                <div className="px-4 pt-3 pb-1.5 border-b border-border/60">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Regional & Thematic Desks
                  </p>
                </div>
                <ul className="py-1.5">
                  {categories.map((c) => {
                    const slug = topicSlug(c);
                    const active = location.pathname === `/topics/${slug}`;
                    return (
                      <li key={c}>
                        <Link
                          to={`/topics/${slug}`}
                          className={cn(
                            "group/item flex items-center justify-between px-4 py-2 text-sm transition-all duration-200 hover:bg-accent hover:pl-5",
                            active
                              ? "font-semibold text-primary bg-accent/50"
                              : "text-popover-foreground hover:text-primary"
                          )}
                        >
                          <span>{c}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0 text-[hsl(var(--brand-red))]" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {navLink("/interview", "Interview")}

            {/* About dropdown */}
            <div className="group relative py-2">
              <button
                className={cn(
                  "relative inline-flex items-center gap-1 text-sm font-medium uppercase tracking-wide transition-all duration-300",
                  isAboutActive
                    ? "text-primary [text-shadow:0_0_12px_hsl(var(--primary)/0.6)]"
                    : "text-background/90 hover:text-primary hover:[text-shadow:0_0_12px_hsl(var(--primary)/0.6)]"
                )}
              >
                About Us{" "}
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                {isAboutActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[hsl(var(--brand-red))]"
                  />
                )}
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 w-52 -translate-x-1/2 translate-y-2 border border-border bg-popover opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="h-1 w-full bg-[hsl(var(--brand-red))]" />
                <ul className="py-1.5">
                  <li>
                    <Link
                      to="/about/who-we-are"
                      className="group/item flex items-center justify-between px-4 py-2.5 text-sm text-popover-foreground transition-all duration-200 hover:bg-accent hover:pl-5 hover:text-primary"
                    >
                      <span>Who We Are</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover/item:opacity-100 text-[hsl(var(--brand-red))]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about/policy"
                      className="group/item flex items-center justify-between px-4 py-2.5 text-sm text-popover-foreground transition-all duration-200 hover:bg-accent hover:pl-5 hover:text-primary"
                    >
                      <span>Editorial Policy</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover/item:opacity-100 text-[hsl(var(--brand-red))]" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {navLink("/magazine", "Magazine")}
            {navLink("/social", "Social Media")}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
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
              className={cn(
                "rounded p-2 transition-all duration-300 hover:bg-background/10 hover:text-primary",
                searchOpen ? "text-primary bg-background/10" : "text-background"
              )}
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

        {/* Animated Search Drawer */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-background/20 bg-foreground/95 backdrop-blur-xl"
            >
              <div className="container-editorial py-5">
                <div className="flex items-center gap-3 border-b-2 border-background/30 py-2 transition-all focus-within:border-primary">
                  <Search className="h-5 w-5 text-primary shrink-0" />
                  <input
                    autoFocus
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder="Search articles, regions, diplomacy, authors… (Press Enter)"
                    className="w-full bg-transparent text-base text-background outline-none placeholder:text-background/40"
                  />
                  {searchQuery.trim() && (
                    <button
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="shrink-0 bg-[hsl(var(--brand-red))] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary transition-colors"
                    >
                      Search
                    </button>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-background/50 mr-1">
                    Desks:
                  </span>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/topics/${topicSlug(cat)}`}
                      onClick={() => setSearchOpen(false)}
                      className="border border-background/20 px-2.5 py-0.5 text-[11px] font-medium text-background/75 hover:border-primary hover:bg-primary hover:text-white transition-all"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[9998] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.nav
              ref={panelRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 bottom-0 w-[min(330px,86vw)] bg-background border-l border-border flex flex-col overflow-y-auto shadow-2xl"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <span className="font-serif text-lg font-bold text-foreground">
                  Navigation
                </span>
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
                  ["/about/policy", "Editorial Policy"],
                ].map(([to, label]) => (
                  <Link
                    key={to}
                    to={to}
                    className={cn(
                      "border-b border-border py-3.5 text-sm font-semibold uppercase tracking-wide transition-all duration-300 flex items-center justify-between",
                      location.pathname === to
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    )}
                  >
                    <span>{label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                  </Link>
                ))}
              </div>

              {/* Topics */}
              <div className="px-6 py-4 border-t border-border">
                <p className="kicker mb-4">Regional Desks</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {categories.map((c) => (
                    <Link
                      key={c}
                      to={`/topics/${topicSlug(c)}`}
                      className="text-sm text-foreground/90 py-1 transition-all duration-200 hover:text-primary font-medium"
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
                  className="flex w-full items-center justify-between rounded border border-border px-4 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:bg-accent hover:text-primary"
                >
                  <span>
                    {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  </span>
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
