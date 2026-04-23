import { useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";

const content = {
  "who-we-are": {
    title: "Who We Are",
    kicker: "About",
    body: [
      "The Global Doctrine is an independent geopolitical magazine dedicated to uncovering the reality behind global headlines. While traditional media focuses on statecraft and high-level strategy, we look at conflict through the lens of ordinary people—those directly impacted by the politics that happen beyond borders.",
      "Our Vision: We aim to provide a grounded, unfiltered look at the world as it really is. By stripping away political abstractions, we bring the human cost of global tensions to the forefront of the conversation.",
      "An Ordinary Perspective: We believe the most important stories aren't found in diplomatic chambers, but in the lives of those living through the consequences of global decisions. Our team of International Relations students combines academic insight with a commitment to \"bottom-up\" storytelling, offering a fresh, independent perspective that prioritizes people over power.",
      "The Global Doctrine. Informing the world through the eyes of its people.",
    ],
  },
  policy: {
    title: "Editorial Policy",
    kicker: "About",
    body: [
      "Independence. The Global Doctrine accepts no funding from governments, political parties, or partisan organisations. Our editorial decisions are made solely by our masthead.",
      "Sourcing. We attribute claims, name our sources where possible, and identify anonymous sources by their position and proximity to the events described. We do not pay for interviews.",
      "Corrections. Errors of fact are corrected promptly, transparently, and at the top of the affected article. Substantive corrections carry a dated note.",
      "Conflicts of interest. Contributors disclose any affiliation, financial or personal, that a reasonable reader might consider relevant to the subject matter.",
      "Neutrality. We aim for accuracy rather than false balance. Where the evidence points clearly in one direction, we will say so.",
    ],
  },
} as const;

const About = () => {
  const { section } = useParams<{ section: keyof typeof content }>();
  const data = section && content[section];
  if (!data) return <Navigate to="/about/who-we-are" replace />;

  return (
    <Layout>
      <section className="border-b border-border bg-secondary">
        <div className="container-editorial py-12 lg:py-16">
          <p className="kicker">{data.kicker}</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{data.title}</h1>
        </div>
      </section>

      <article className="container-editorial py-14">
        <div className="mx-auto max-w-2xl space-y-6">
          {data.body.map((p, i) => (
            <p key={i} className={i === 0 ? "text-xl leading-relaxed text-foreground first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.9] first-letter:text-[hsl(var(--brand-red))]" : "text-base leading-relaxed text-foreground/90"}>
              {p}
            </p>
          ))}
        </div>
      </article>
    </Layout>
  );
};

export default About;
