import southchina from "@/assets/article-southchinasea.jpg";
import energy from "@/assets/article-energy.jpg";
import middleeast from "@/assets/article-middleeast.jpg";
import africa from "@/assets/article-africa.jpg";
import asia from "@/assets/article-asia.jpg";
import europe from "@/assets/article-europe.jpg";

export type Category =
  | "Cover Story"
  | "International"
  | "Europe"
  | "Asia"
  | "Africa"
  | "Middle East"
  | "Diplomacy";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  author: string;
  date: string;
  image: string;
  featured?: boolean;
}

export const categories: Category[] = [
  "Cover Story",
  "International",
  "Europe",
  "Asia",
  "Africa",
  "Middle East",
  "Diplomacy",
];

export const articles: Article[] = [
  {
    slug: "rising-tensions-south-china-sea",
    title: "Rising Tensions in the South China Sea",
    excerpt:
      "Naval drills, contested reefs, and a shifting balance of power: how a body of water became the world's most consequential flashpoint.",
    category: "Asia",
    author: "Anika Rao",
    date: "April 18, 2026",
    image: southchina,
    featured: true,
  },
  {
    slug: "europes-energy-crisis-explained",
    title: "Europe's Energy Crisis Explained",
    excerpt:
      "From Berlin's industrial heartland to the Iberian grid, the continent is rewriting the rules of energy security in real time.",
    category: "Europe",
    author: "Marc Delacroix",
    date: "April 15, 2026",
    image: energy,
  },
  {
    slug: "future-middle-eastern-diplomacy",
    title: "The Future of Middle Eastern Diplomacy",
    excerpt:
      "Quiet backchannels, public handshakes, and a generation of envoys reshaping a region long defined by its fault lines.",
    category: "Middle East",
    author: "Layla Haddad",
    date: "April 12, 2026",
    image: middleeast,
  },
  {
    slug: "africa-rising-institutions",
    title: "Africa's New Institutional Moment",
    excerpt:
      "Continental bodies are demanding a louder voice in global governance — and increasingly, they are being heard.",
    category: "Africa",
    author: "Kwame Boateng",
    date: "April 10, 2026",
    image: africa,
  },
  {
    slug: "asia-tech-cold-war",
    title: "Inside Asia's Quiet Tech Cold War",
    excerpt:
      "Semiconductors, subsea cables, and standards bodies: the next frontier of great-power competition is engineered, not declared.",
    category: "Asia",
    author: "Jin Park",
    date: "April 7, 2026",
    image: asia,
  },
  {
    slug: "europe-defence-doctrine",
    title: "Europe Drafts a New Defence Doctrine",
    excerpt:
      "Brussels is rethinking what collective security means in an age when every supply chain is a strategic asset.",
    category: "Europe",
    author: "Sofia Lindqvist",
    date: "April 4, 2026",
    image: europe,
  },
];

export const articleBody = `
The slow choreography of statecraft rarely makes for dramatic headlines. Yet beneath the routine communiqués and carefully staged photo opportunities, a quieter realignment is underway — one that may define the coming decade more decisively than any single summit.

Officials interviewed for this piece described a landscape where established alliances are being stress-tested in ways unimaginable just five years ago. "The old assumptions no longer hold," said one senior diplomat, speaking on condition of anonymity. "We are negotiating in a world that has not yet decided what it wants to be."

What is emerging is neither a new bipolar order nor a return to multipolarity in any classical sense. It is something stranger: a patchwork of overlapping arrangements, each calibrated to a specific issue, each subject to revision without notice.

For ordinary citizens, the consequences are tangible. Energy prices, food supplies, and the cost of credit all reflect decisions made in rooms they will never see. The challenge for journalism — and for this magazine — is to make those rooms visible.
`.trim();
