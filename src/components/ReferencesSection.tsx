import { ExternalLink, BookMarked } from "lucide-react";
import { cleanText } from "@/lib/editorialText";

interface Reference {
  text: string;
  url?: string;
  credit?: string;
}

interface ReferencesSectionProps {
  references: Reference[];
}

export const ReferencesSection = ({ references }: ReferencesSectionProps) => {
  if (!references || references.length === 0) return null;

  return (
    <section className="mt-14 border-t border-border bg-secondary/35 p-6 sm:p-8" style={{ borderLeft: "3px solid hsl(var(--brand-red))" }}>
      <div className="mb-5 flex items-center gap-2.5">
        <BookMarked className="h-4 w-4 text-[hsl(var(--brand-red))]" />
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--brand-red))]">
          References, Citations & Credits
        </h3>
      </div>
      <ol className="space-y-3.5">
        {references.map((ref, i) => (
          <li key={i} className="flex gap-3 text-xs sm:text-sm leading-relaxed group">
            <span className="shrink-0 font-serif font-bold text-[hsl(var(--brand-red))] tabular-nums">
              [{String(i + 1).padStart(2, "0")}]
            </span>
            <div className="space-y-0.5 text-pretty break-words min-w-0">
              {ref.url ? (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-baseline gap-1.5 font-medium text-primary underline decoration-primary/50 underline-offset-4 transition-colors hover:text-[hsl(var(--brand-red))]"
                >
                  <span>{cleanText(ref.text)}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-70 translate-y-0.5" />
                </a>
              ) : (
                <span className="text-foreground/85">{cleanText(ref.text)}</span>
              )}
              {ref.credit && (
                <p className="text-xs text-muted-foreground italic">{cleanText(ref.credit)}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
