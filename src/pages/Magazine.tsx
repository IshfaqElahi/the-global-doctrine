import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
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
        const query = `*[_type == "magazineIssue"] | order(publishedAt desc) {
          _id, title, issue, publishDate, coverImage,
          "pdfUrl": pdfFile.asset->url
        }`;
        const data = await client.fetch(query);
        setIssues(data);
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
      <section className="border-b border-border">
        <div className="container-editorial py-12 lg:py-16">
          <p className="kicker">Print & Digital</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            The Magazine
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            A quarterly print edition and rolling digital archive. Browse past issues, download covers, or subscribe to receive future editions.
          </p>
        </div>
      </section>

      <section className="container-editorial py-14">
        {isLoading ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <SkeletonMagazineCard key={i} />)}
          </div>
        ) : issues.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl font-bold text-foreground">No issues published yet.</p>
            <p className="mt-2 text-muted-foreground">Check back soon for our latest edition.</p>
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {issues.map((m) => (
              <article
                key={m._id}
                className="group border border-border bg-background shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                style={{ borderLeft: "3px solid hsl(var(--brand-red))" }}
              >
                <div className="overflow-hidden bg-muted">
                  {m.coverImage && (
                    <img
                      src={urlFor(m.coverImage).url()}
                      alt={`${m.issue} — ${m.title}`}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p className="kicker">
                    {m.issue}{m.publishDate ? ` · ${m.publishDate}` : ""}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-bold leading-tight text-foreground">
                    {m.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-[hsl(var(--brand-red))] text-white hover:bg-primary border-none transition-colors duration-300"
                      onClick={() => window.open("https://wa.me/8801612970419", "_blank")}
                    >
                      Buy Print
                    </Button>
                    {m.pdfUrl ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-foreground/20 bg-transparent text-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
                          onClick={() => window.open(m.pdfUrl, "_blank")}
                        >
                          View
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="border border-transparent bg-foreground text-background hover:bg-transparent hover:border-foreground hover:text-foreground transition-colors duration-300"
                          onClick={() => handleDownloadPDF(m.pdfUrl)}
                        >
                          Download
                        </Button>
                      </>
                    ) : (
                      <span className="text-sm italic text-muted-foreground">
                        Digital copy coming soon
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Magazine;