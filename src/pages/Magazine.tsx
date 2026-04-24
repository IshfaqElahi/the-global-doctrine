import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

// Only import the ONE image you are actually using in the array below
import magGlobalDoctrine from "@/assets/magazine-global-doctrine-1.jpg";

const issues = [
  { src: magGlobalDoctrine, title: "The Global Doctrine", issue: "1st Edition", date: "March 2026", pdf: "/magazine-global-doctrine-1.pdf" }
];

const Magazine = () => {
  const handleDownloadPDF = (pdfUrl: string) => {
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
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {issues.map((m, i) => (
          <article key={i} className="group">
            <div className="overflow-hidden border border-border bg-muted shadow-sm">
              <img src={m.src} alt={`${m.issue} — ${m.title}`} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            </div>
            <p className="kicker mt-5">{m.issue} · {m.date}</p>
            <h3 className="mt-1 font-serif text-2xl font-bold leading-tight">{m.title}</h3>
            <div className="mt-4 flex gap-2">
              <Button variant="default" size="sm" className="bg-foreground text-background hover:bg-foreground/90">View Issue</Button>
              <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(m.pdf)}>Download PDF</Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  </Layout>
)};

export default Magazine;