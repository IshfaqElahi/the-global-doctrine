import { ExternalLink } from "lucide-react";

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
    <section className="mt-12 border-t border-border pt-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-[2px] w-6 bg-[hsl(var(--brand-red))]" />
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--brand-red))]">
          References & Credits
        </h3>
      </div>
      <ol className="space-y-3">
        {references.map((ref, i) => (
          <li key={i} className="flex gap-3 text-sm group">
            <span className="shrink-0 font-bold text-[hsl(var(--brand-red))] tabular-nums">
              [{i + 1}]
            </span>
            <div className="space-y-0.5">
              {ref.url ? (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary underline underline-offset-2 transition-colors hover:text-[hsl(var(--brand-red))]"
                >
                  {ref.text}
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                </a>
              ) : (
                <span className="text-foreground/80">{ref.text}</span>
              )}
              {ref.credit && (
                <p className="text-xs text-muted-foreground italic">{ref.credit}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};