import { Facebook, Instagram, Mail, Twitter, ExternalLink } from "lucide-react";
import { Layout } from "@/components/Layout";

const channels = [
  { Icon: Facebook, name: "Facebook", handle: "@globaldoctrine", href: "#", desc: "Daily article shares and live coverage threads." },
  { Icon: Instagram, name: "Instagram", handle: "@global.doctrine", href: "#", desc: "Field photography, magazine covers, and visual essays." },
  { Icon: Twitter, name: "X / Twitter", handle: "@GlblDoctrine", href: "#", desc: "Breaking analysis from our editors and contributors." },
  { Icon: Mail, name: "Email", handle: "hello@globaldoctrine.org", href: "mailto:hello@globaldoctrine.org", desc: "Tips, pitches, and reader letters welcome." },
];

const Social = () => (
  <Layout>
    <section className="border-b border-border bg-secondary">
      <div className="container-editorial py-12 lg:py-16">
        <p className="kicker">Connect</p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">Social Media</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Follow our reporting across platforms — or reach the newsroom directly.
        </p>
      </div>
    </section>

    <section className="container-editorial py-14">
      <div className="grid gap-6 sm:grid-cols-2">
        {channels.map(({ Icon, name, handle, href, desc }) => (
          <a key={name} href={href} className="group flex items-start gap-5 border border-border bg-background p-6 transition-all hover:border-foreground hover:shadow-md">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-primary text-primary-foreground transition-colors group-hover:bg-[hsl(var(--brand-red))]">
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold">{name}</h3>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-1 text-sm font-medium text-primary">{handle}</p>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  </Layout>
);

export default Social;
