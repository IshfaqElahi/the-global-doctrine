import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import { Logo } from "./Logo";
import { categories } from "@/data/articles";

const slug = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

export const Footer = () => (
  <footer className="mt-20 border-t border-border bg-secondary">
    <div className="container-editorial py-14">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            An independent geopolitical magazine covering world conflicts and global affairs through the lens of ordinary people. Run by International Relations students.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: Instagram, label: "Instagram" },
              { Icon: Twitter, label: "Twitter" },
              { Icon: Mail, label: "Email" },
            ].map(({ Icon, label }) => (
              <a key={label} href="#" aria-label={label} className="flex h-9 w-9 items-center justify-center border border-border bg-background transition-colors hover:bg-primary hover:text-primary-foreground">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-foreground">Topics</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.slice(0, 6).map((c) => (
              <li key={c}><Link to={`/topics/${slug(c)}`} className="hover:text-primary">{c}</Link></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-foreground">Sections</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/interview" className="hover:text-primary">Interview</Link></li>
            <li><Link to="/magazine" className="hover:text-primary">Magazine</Link></li>
            <li><Link to="/social" className="hover:text-primary">Social Media</Link></li>
            <li><Link to="/about/who-we-are" className="hover:text-primary">Who We Are</Link></li>
            <li><Link to="/about/policy" className="hover:text-primary">Policy</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-foreground">Contact</h4>
          <p className="text-sm text-muted-foreground">Editorial enquiries</p>
          <a href="mailto:theglobaldoctrine.mag@gmail.com" className="text-sm font-medium text-primary hover:underline">theglobaldoctrine.mag@gmail.com</a>
          <p className="mt-4 text-sm text-muted-foreground">Press & syndication</p>
          <a href="mailto:theglobaldoctrine.mag@gmail.com" className="text-sm font-medium text-primary hover:underline">theglobaldoctrine.mag@gmail.com</a>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} The Global Doctrine. All rights reserved.</p>
        <p>Independent journalism, reader-supported.</p>
      </div>
    </div>
  </footer>
);
