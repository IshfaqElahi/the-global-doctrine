import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, Variants } from "framer-motion";
import { BookOpen, Download, Eye, ShoppingBag } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { EditorialImage } from "@/components/EditorialImage";
import { client, urlFor } from "@/lib/sanity";

interface MagazineIssue {
  _id: string;
  title: string;
  issue: string;
  publishDate: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverImage: any;
  pdfUrl: string;
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.14 },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const SkeletonMagazineCard = () => (
  <div className="animate-pulse">
    <div className="aspect-[4/5] w-full bg-muted rounded-sm" />
    <div className="mt-5 space-y-2">
      <div className="h-3 w-24 bg-muted rounded" />
      <div className="h-6 w-full bg-muted rounded" />
      <div className="h-6 w-3/4 bg-muted rounded" />
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-20 bg-muted rounded" />
        <div className="h-8 w-16 bg-muted rounded" />
        <div className="h-8 w-24 bg-muted rounded" />
      </div>
    </div>
  </div>
);

const Magazine = () => {
  const [issues, setIssues] = useState<MagazineIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const query = `*[_type == "magazineIssue"] | order(_createdAt desc) {
          _id, title, issue, publishDate, coverImage,
          "pdfUrl": pdfFile.asset->url
        }`;
        const data = await client.fetch(query);
        setIssues(data || []);
      } catch (error) {
        console.error("Error fetching magazines:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const handleDownloadPDF = (pdfUrl: string) => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = pdfUrl.split("/").pop() || "magazine.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <Helmet>
        <title>The Magazine — The Global Doctrine</title>
        <meta
          name="description"
          content="A quarterly print edition and rolling digital archive of The Global Doctrine."
        />
      </Helmet>

      <section className="border-b border-border bg-secondary editorial-grid-bg">
        <div className="container-editorial py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="kicker inline-flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5" />
              Print & Digital Editions
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-foreground">
              The Magazine
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg border-l-2 border-primary pl-4">
              A quarterly print edition and rolling digital archive. Browse past issues, download covers, or order print editions directly.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container-editorial py-16">
        {isLoading ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <SkeletonMagazineCard key={i} />
            ))}
          </div>
        ) : issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border bg-secondary/50 py-24 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--brand-red))] text-white mb-4">
              <span className="font-serif text-2xl">!</span>
            </div>
            <p className="font-serif text-2xl font-bold text-foreground">No issues published yet.</p>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              Check back soon for our latest edition.
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {issues.map((m, idx) => (
              <motion.article
                key={m._id}
                variants={fadeUpItem}
                className="group editorial-card flex flex-col overflow-hidden"
                style={{ borderLeft: "3px solid hsl(var(--brand-red))" }}
              >
                <div className="relative overflow-hidden bg-muted before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-2 before:bg-gradient-to-r before:from-black/25 before:to-transparent before:z-30">
                  {m.coverImage && (
                    <EditorialImage
                      src={urlFor(m.coverImage).auto("format").width(800).url()}
                      alt={`${m.issue} — ${m.title}`}
                      variant="portrait"
                      priority={idx === 0}
                    />
                  )}
                </div>
                <div className="flex flex-col flex-grow p-6">
                  <p className="kicker">
                    {m.issue}
                    {m.publishDate ? ` · ${m.publishDate}` : ""}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-foreground flex-grow group-hover:text-primary transition-colors">
                    {m.title}
                  </h3>

                  <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center gap-2.5">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-[hsl(var(--brand-red))] text-white hover:bg-primary border-none transition-colors duration-300 gap-1.5"
                      onClick={() => window.open("https://wa.me/8801612970419", "_blank")}
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Buy Print
                    </Button>
                    {m.pdfUrl ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-foreground/20 bg-transparent text-foreground hover:bg-foreground hover:text-background transition-colors duration-300 gap-1.5"
                          onClick={() => window.open(m.pdfUrl, "_blank")}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="border border-transparent bg-foreground text-background hover:bg-transparent hover:border-foreground hover:text-foreground transition-colors duration-300 gap-1.5"
                          onClick={() => handleDownloadPDF(m.pdfUrl)}
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </Button>
                      </>
                    ) : (
                      <span className="text-[13px] italic text-muted-foreground">
                        Digital copy coming soon
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </section>
    </Layout>
  );
};

export default Magazine;
