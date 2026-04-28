import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { client, urlFor } from "@/lib/sanity";

// This tells TypeScript what data to expect from your Sanity database
interface MagazineIssue {
  _id: string;
  title: string;
  issue: string;
  publishDate: string;
  // Tell TypeScript to ignore the 'any' rule for the Sanity image object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverImage: any;
  pdfUrl: string;
}

const Magazine = () => {
  const [issues, setIssues] = useState<MagazineIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // This function reaches out to Sanity to grab your published magazines
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const query = `*[_type == "magazineIssue"] | order(_createdAt desc) {
          _id,
          title,
          issue,
          publishDate,
          coverImage,
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
    link.download = pdfUrl.split('/').pop() || 'magazine.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <section className="border-b border-border">
        <div className="container-editorial py-12 lg:py-16">
          <p className="kicker">Print & Digital</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">The Magazine</h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            A quarterly print edition and rolling digital archive. Browse past issues, download covers, or subscribe to receive future editions.
          </p>
        </div>
      </section>

      <section className="container-editorial py-14">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading archive...</p>
        ) : issues.length === 0 ? (
          <p className="text-center text-muted-foreground">No issues published yet.</p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {issues.map((m) => (
              <article key={m._id} className="group">
                <div className="overflow-hidden border border-border bg-muted shadow-sm">
                  {/* We use urlFor() here to process the image from Sanity */}
                  {m.coverImage && (
                    <img 
                      src={urlFor(m.coverImage).url()} 
                      alt={`${m.issue} — ${m.title}`} 
                      loading="lazy" 
                      className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" 
                    />
                  )}
                </div>
                <p className="kicker mt-5">{m.issue} {m.publishDate ? `· ${m.publishDate}` : ''}</p>
                <h3 className="mt-1 font-serif text-2xl font-bold leading-tight">{m.title}</h3>
                <div className="mt-4 flex gap-2">
                  {m.pdfUrl ? (
                    <>
                      <Button variant="default" size="sm" className="bg-foreground text-background hover:bg-foreground/90" onClick={() => handleDownloadPDF(m.pdfUrl)}>Download PDF</Button>
                      <Button variant="outline" size="sm" onClick={() => window.open('https://wa.me/8801612970419', '_blank')}>Buy Now</Button>
                    </>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">PDF coming soon</p>
                  )}
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