import { Facebook, Instagram, Linkedin, MessageCircle, Youtube, ExternalLink } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";

const channels = [
  {
    Icon: Facebook,
    name: "Facebook",
    handle: "The Global Doctrine",
    href: "https://www.facebook.com/p/The-Global-Doctrine-61577469676531/",
    desc: "Daily article shares, geopolitical dispatches, and live coverage threads.",
  },
  {
    Icon: Instagram,
    name: "Instagram",
    handle: "@the_global_doctrine",
    href: "https://www.instagram.com/the_global_doctrine",
    desc: "Field photography, magazine covers, and visual geopolitical essays.",
  },
  {
    Icon: Youtube,
    name: "YouTube",
    handle: "@TheGlobalDoctrine-p8v",
    href: "https://www.youtube.com/@TheGlobalDoctrine-p8v",
    desc: "Video dispatches, briefings, and long-form geopolitical discussions.",
  },
  {
    Icon: MessageCircle,
    name: "WhatsApp",
    handle: "01612-970419",
    href: "https://wa.me/8801612970419",
    desc: "Direct line to our newsroom inbox and print edition orders.",
  },
  {
    Icon: Linkedin,
    name: "LinkedIn",
    handle: "The Global Doctrine",
    href: "https://www.linkedin.com/company/the-global-doctrine/",
    desc: "Professional network, contributor calls, and organizational updates.",
  },
];

const Social = () => (
  <Layout>
    <Helmet>
      <title>Social Media — The Global Doctrine</title>
      <meta name="description" content="Connect with The Global Doctrine across Facebook, Instagram, YouTube, WhatsApp, and LinkedIn." />
    </Helmet>

    <section className="border-b border-border bg-secondary editorial-grid-bg">
      <div className="container-editorial py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="kicker inline-flex items-center gap-2">
            <span className="h-[2px] w-6 bg-[hsl(var(--brand-red))]" />
            Connect
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Social Media
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg border-l-2 border-primary pl-4">
            Follow our reporting across platforms — or reach the newsroom directly.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="container-editorial py-14">
      <div className="grid gap-6 sm:grid-cols-2">
        {channels.map(({ Icon, name, handle, href, desc }, idx) => (
          <motion.a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className="group editorial-card flex items-start gap-5 p-6"
            style={{ borderLeft: "3px solid hsl(var(--brand-red))" }}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-primary text-primary-foreground transition-colors duration-300 group-hover:bg-[hsl(var(--brand-red))]">
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </div>
              <p className="mt-1 text-sm font-semibold text-primary truncate">{handle}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  </Layout>
);

export default Social;
