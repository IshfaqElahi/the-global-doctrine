import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Mail, Instagram, Twitter, Youtube, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { EditorialPortableText } from "@/components/EditorialPortableText";
import { client } from "@/lib/sanity";

interface AboutContent {
  title: string;
  section: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[];
}

const DEFAULT_POLICY_BLOCKS = [
  {
    _key: "pol-1",
    _type: "block",
    style: "h2",
    children: [{ _key: "pol-1s", _type: "span", marks: [], text: "Editorial Independence & Mission" }],
  },
  {
    _key: "pol-2",
    _type: "block",
    style: "normal",
    children: [
      {
        _key: "pol-2s",
        _type: "span",
        marks: [],
        text: "The Global Doctrine operates as a strictly independent geopolitical publication founded and run by scholars and students of International Relations. Our editorial decisions are driven solely by analytical rigor, public interest, and the pursuit of truth—free from partisan, corporate, or state sponsorship.",
      },
    ],
  },
  {
    _key: "pol-3",
    _type: "block",
    style: "h2",
    children: [{ _key: "pol-3s", _type: "span", marks: [], text: "Verification, Sourcing & Fact-Checking" }],
  },
  {
    _key: "pol-4",
    _type: "block",
    style: "normal",
    children: [
      {
        _key: "pol-4s",
        _type: "span",
        marks: [],
        text: "Every dispatch, cover story, and regional analysis undergoes multi-stage editorial review prior to publication. Writers are required to corroborate claims through primary documents, official treaties, verified open-source intelligence, and reputable international observers. Where external data or research is cited, full attributions are provided in the article's References & Credits section.",
      },
    ],
  },
  {
    _key: "pol-5",
    _type: "block",
    style: "h2",
    children: [{ _key: "pol-5s", _type: "span", marks: [], text: "People-First Geopolitical Perspective" }],
  },
  {
    _key: "pol-6",
    _type: "block",
    style: "normal",
    children: [
      {
        _key: "pol-6s",
        _type: "span",
        marks: [],
        text: "While traditional foreign-policy outlets often reduce global affairs to abstract board-game strategy, The Global Doctrine evaluates diplomacy, sanctions, and armed conflict through their tangible consequences for ordinary citizens on the ground.",
      },
    ],
  },
  {
    _key: "pol-7",
    _type: "block",
    style: "h2",
    children: [{ _key: "pol-7s", _type: "span", marks: [], text: "Corrections & Right of Reply" }],
  },
  {
    _key: "pol-8",
    _type: "block",
    style: "normal",
    children: [
      {
        _key: "pol-8s",
        _type: "span",
        marks: [],
        text: "We are committed to transparency and accountability. If a factual error is identified after publication, our editorial desk promptly issues a transparent correction note. Readers, researchers, and institutions may submit corrections or analytical responses directly to theglobaldoctrine.mag@gmail.com.",
      },
    ],
  },
];

const VALID_SECTIONS = ["who-we-are", "policy"];

const About = () => {
  const { section } = useParams<{ section: string }>();
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!section || !VALID_SECTIONS.includes(section)) return;

    setLoading(true);
    client
      .fetch(
        `*[_type == "aboutPage" && section == $section][0]{
        title, section, body
      }`,
        { section }
      )
      .then((data) => setContent(data || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [section]);

  if (!section || !VALID_SECTIONS.includes(section)) {
    return <Navigate to="/about/who-we-are" replace />;
  }

  const sectionLabel = section === "who-we-are" ? "Who We Are" : "Editorial Policy";
  const bodyBlocks =
    content?.body?.length
      ? content.body
      : section === "policy"
      ? DEFAULT_POLICY_BLOCKS
      : [];

  return (
    <Layout>
      <Helmet>
        <title>{sectionLabel} — The Global Doctrine</title>
        <meta
          name="description"
          content={`Learn about The Global Doctrine — ${sectionLabel.toLowerCase()}.`}
        />
      </Helmet>

      {/* Header */}
      <section className="border-b border-border bg-secondary editorial-grid-bg">
        <div className="container-editorial py-12 lg:py-16">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="kicker inline-flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[hsl(var(--brand-red))]" />
              About The Global Doctrine
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-balance">
              {loading ? sectionLabel : content?.title || sectionLabel}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <div className="container-editorial py-14">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main content */}
          <article className="lg:col-span-8 max-w-2xl">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="skeleton rounded h-5 w-full"
                    style={{ width: `${[100, 90, 95, 80, 88][i]}%` }}
                  />
                ))}
              </div>
            ) : bodyBlocks.length > 0 ? (
              <EditorialPortableText
                value={bodyBlocks}
                enableDropCap={true}
                showTableOfContents={false}
                showEndMark={true}
              />
            ) : (
              <div className="space-y-4 text-foreground/90">
                <p className="text-muted-foreground italic">
                  No content has been published yet for this section.
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
                          ? "text-primary font-bold"
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
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Editorial
                  </p>
                  <a
                    href="mailto:theglobaldoctrine.mag@gmail.com"
                    className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    theglobaldoctrine.mag@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    WhatsApp
                  </p>
                  <a
                    href="https://wa.me/8801612970419"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
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
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-border px-3 py-2.5 text-xs font-medium text-foreground transition-all hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Founded note */}
            <div
              className="p-6"
              style={{
                borderLeft: "3px solid hsl(var(--brand-red))",
                backgroundColor: "hsl(var(--secondary))",
              }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--brand-red))] mb-2">
                Independent · Student-run · Since 2026
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
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
