import { Link } from "react-router-dom";
import { Instagram, Mail, Twitter, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { categories } from "@/data/articles";

const slug = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

const socials = [
  { Icon: Twitter, label: "X / Twitter", href: "https://twitter.com/theglobaldoctrine" },
  { Icon: Instagram, label: "Instagram", href: "https://instagram.com/theglobaldoctrine" },
  { Icon: Youtube, label: "YouTube", href: "https://youtube.com/@theglobaldoctrine" },
  { Icon: Mail, label: "Email", href: "mailto:theglobaldoctrine.mag@gmail.com" },
];

export const Footer = () => (
  <footer className="mt-20 border-t-4 border-[hsl(var(--brand-red))] bg-foreground text-background">
    <div className="container-editorial py-16">
      <div className="grid gap-12 md:grid-cols-12">

        {/* Brand column */}
        <div className="md:col-span-4">
          <div className="footer-logo">
  <Logo />
</div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-background/60">
            An independent geopolitical magazine covering world conflicts, diplomacy, and global affairs through the lens of ordinary people. Founded and run by International Relations students.
          </p>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--brand-red))]">
            Independent · Student-run · Since 2024
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map(({ Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center border border-background/20 text-background/70 transition-all hover:border-[hsl(var(--brand-red))] hover:bg-[hsl(var(--brand-red))] hover:text-white">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className="md:col-span-2">
          <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-background/40">Topics</h4>
          <ul className="space-y-3 text-sm">
            {categories.map((c) => (
              <li key={c}>
                <Link to={`/topics/${slug(c)}`}
                  className="text-background/70 transition-colors hover:text-[hsl(var(--brand-red))]">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="md:col-span-2">
          <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-background/40">Sections</h4>
          <ul className="space-y-3 text-sm">
            {[
              ["/", "Home"],
              ["/interview", "Interview"],
              ["/magazine", "Magazine"],
              ["/all-articles", "All Articles"],
              ["/social", "Social Media"],
              ["/about/who-we-are", "Who We Are"],
              ["/about/policy", "Policy"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-background/70 transition-colors hover:text-[hsl(var(--brand-red))]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-4">
          <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-background/40">Contact</h4>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-background/40 text-xs uppercase tracking-wider mb-1">Editorial</p>
              <a href="mailto:theglobaldoctrine.mag@gmail.com"
                className="text-background/80 hover:text-[hsl(var(--brand-red))] transition-colors">
                theglobaldoctrine.mag@gmail.com
              </a>
            </div>
            <div>
              <p className="text-background/40 text-xs uppercase tracking-wider mb-1">Press & Syndication</p>
              <a href="mailto:theglobaldoctrine.mag@gmail.com"
                className="text-background/80 hover:text-[hsl(var(--brand-red))] transition-colors">
                theglobaldoctrine.mag@gmail.com
              </a>
            </div>
            <div className="pt-4 border-t border-background/10">
              <p className="text-xs text-background/40 leading-relaxed">
                We publish independent analysis on geopolitics, international relations, and global security. Our editorial team is committed to accuracy, depth, and accessibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-background/10 pt-6 text-xs text-background/40 sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} The Global Doctrine. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/about/policy" className="hover:text-background/70 transition-colors">Editorial Policy</Link>
          <Link to="/about/who-we-are" className="hover:text-background/70 transition-colors">About Us</Link>
        </div>
      </div>
    </div>
  </footer>
);