import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Mail, Instagram, Twitter, Youtube, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { client } from "@/lib/sanity";

interface AboutContent {
  title: string;
  section: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[];
}

// Portable text styling
const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-base leading-relaxed text-foreground/90">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-10 font-serif text-2xl font-bold text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-6 font-serif text-xl font-bold text-[hsl(var(--brand-red))]">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-[hsl(var(--brand-red))] pl-5 font-serif text-xl italic leading-snug text-foreground">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:text-[hsl(var(--brand-red))] transition-colors">
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-5 ml-5 list-disc space-y-2 text-base leading-relaxed">{children}</ul>,
    number: ({ children }) => <ol className="mb-5 ml-5 list-decimal space-y-2 text-base leading-relaxed">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-foreground/90">{children}</li>,
    number: ({ children }) => <li className="text-foreground/90">{children}</li>,
  },
};

const VALID_SECTIONS = ["who-we-are", "policy"];

const About = () => {
  const { section } = useParams<{ section: string }>();
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. ALL HOOKS GO AT THE TOP
  useEffect(() => {
    // If it's an invalid section, skip fetching
    if (!section || !VALID_SECTIONS.includes(section)) return;

    setLoading(true);
    client.fetch(`
      *[_type == "aboutPage" && section == $section][0]{
        title, section, body
      }
    `, { section })
      .then((data) => setContent(data || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [section]);

  // 2. EARLY RETURNS GO AFTER HOOKS
  if (!section || !VALID_SECTIONS.includes(section)) {
    return <Navigate to="/about/who-we-are" replace />;
  }

  const sectionLabel = section === "who-we-are" ? "Who We Are" : "Editorial Policy";

  return (
    <Layout>
      <Helmet>
        <title>{sectionLabel} — The Global Doctrine</title>
        <meta name="description" content={`Learn about The Global Doctrine — ${sectionLabel.toLowerCase()}.`} />
      </Helmet>

      {/* Header */}
      <section className="border-b border-border bg-secondary">
        <div className="container-editorial py-12 lg:py-16">
          <p className="kicker">About</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {loading ? sectionLabel : (content?.title || sectionLabel)}
          </h1>
        </div>
      </section>

      {/* Body */}
      <div className="container-editorial py-14">
        <div className="grid gap-12 lg:grid-cols-12">

          {/* Main content */}
          <article className="lg:col-span-8">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton rounded h-5 w-full" style={{ width: `${[100, 90, 95, 80, 88][i]}%` }} />
                ))}
              </div>
            ) : content?.body?.length ? (
              <div className="[&>p:first-child]:text-xl [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-2 [&>p:first-child]:first-letter:font-serif [&>p:first-child]:first-letter:text-6xl [&>p:first-child]:first-letter:font-bold [&>p:first-child]:first-letter:leading-[0.9] [&>p:first-child]:first-letter:text-[hsl(var(--brand-red))]">
                <PortableText value={content.body} components={ptComponents} />
              </div>
            ) : (
              <div className="space-y-4 text-foreground/90">
                <p className="text-muted-foreground italic">
                  No content has been published yet for this section.
                  <br />
                  Please upload content via Sanity Studio → About Page.
                </p>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 lg:self-start">

            {/* Quick links */}
            <div className="border border-border bg-background p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                <div className="h-[2px] w-5 bg-[hsl(var(--brand-red))]" />
                <h3 className="text-xs font-bold uppercase tracking-widest">About Us</h3>
              </div>
              <ul className="space-y-1">
                {[
                  ["/about/who-we-are", "Who We Are"],
                  ["/about/policy", "Editorial Policy"],
                ].map(([to, label]) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`flex items-center justify-between py-2.5 text-sm font-medium transition-colors hover:text-primary border-b border-border/50 ${
                        section === to.split("/").pop()
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {label}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="border border-border bg-background p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                <div className="h-[2px] w-5 bg-[hsl(var(--brand-red))]" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Contact</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Editorial</p>
                  <a href="mailto:theglobaldoctrine.mag@gmail.com"
                    className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    theglobaldoctrine.mag@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">WhatsApp</p>
                  <a href="https://wa.me/8801612970419" target="_blank" rel="noopener noreferrer"
                    className="text-sm text-foreground hover:text-primary transition-colors">
                    +880 1612 970419
                  </a>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="border border-border bg-background p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                <div className="h-[2px] w-5 bg-[hsl(var(--brand-red))]" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Follow Us</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { Icon: Twitter, label: "Twitter/X", href: "https://twitter.com/theglobaldoctrine" },
                  { Icon: Instagram, label: "Instagram", href: "https://instagram.com/the_global_doctrine" },
                  { Icon: Youtube, label: "YouTube", href: "https://youtube.com/@theglobaldoctrine" },
                  { Icon: Mail, label: "Email Us", href: "mailto:theglobaldoctrine.mag@gmail.com" },
                ].map(({ Icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-border px-3 py-2.5 text-xs font-medium text-foreground transition-all hover:border-primary hover:text-primary">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Founded note */}
            <div className="p-6" style={{ borderLeft: "3px solid hsl(var(--brand-red))", backgroundColor: "hsl(var(--secondary))" }}>
              <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--brand-red))] mb-2">
                Independent · Student-run · Since 2024
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Founded and run by International Relations students committed to independent, people-first geopolitical reporting.
              </p>
            </div>

          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default About;