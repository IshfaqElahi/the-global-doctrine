import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import interview1 from "@/assets/interview-1.jpg";
import interview2 from "@/assets/interview-2.jpg";

const interviews = [
  {
    slug: "henrik-aaland",
    title: "Diplomacy is the art of postponing certainty",
    person: "Ambassador Henrik Aaland",
    role: "Former UN Special Envoy",
    image: interview1,
    date: "April 16, 2026",
  },
  {
    slug: "elena-vasquez",
    title: "Why the next decade belongs to mid-sized powers",
    person: "Dr. Elena Vásquez",
    role: "Chair of Strategic Studies, Geneva",
    image: interview2,
    date: "April 9, 2026",
  },
  {
    slug: "henrik-aaland-2",
    title: "Inside the back channels of a fractured world",
    person: "Ambassador Henrik Aaland",
    role: "Former UN Special Envoy",
    image: interview1,
    date: "March 28, 2026",
  },
  {
    slug: "elena-vasquez-2",
    title: "The scholar's case for radical patience",
    person: "Dr. Elena Vásquez",
    role: "Chair of Strategic Studies, Geneva",
    image: interview2,
    date: "March 14, 2026",
  },
];

const Interview = () => (
  <Layout>
    <section className="border-b border-border">
      <div className="container-editorial py-12 lg:py-16">
        <p className="kicker">In Conversation</p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">The Interview</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Long-form conversations with the diplomats, scholars, and practitioners shaping the world from inside the room.
        </p>
      </div>
    </section>

    <section className="container-editorial py-12">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-2">
        {interviews.map((i) => (
          <Link to="#" key={i.slug} className="group grid gap-5 sm:grid-cols-[1fr_1.4fr]">
            <div className="overflow-hidden bg-muted">
              <img src={i.image} alt={i.person} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:shadow-lg" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="kicker">{i.date}</p>
              <h2 className="mt-2 font-serif text-2xl font-bold leading-tight group-hover:text-primary">"{i.title}"</h2>
              <p className="mt-3 text-sm font-semibold text-foreground">{i.person}</p>
              <p className="text-xs text-muted-foreground">{i.role}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  </Layout>
);

export default Interview;
