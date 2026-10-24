import { useMemo } from "react";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { ListOrdered } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import { normalizePortableText, slugifyHeading } from "@/lib/editorialText";

interface EditorialPortableTextProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any[];
  enableDropCap?: boolean;
  showTableOfContents?: boolean;
  showEndMark?: boolean;
}

export const EditorialPortableText = ({
  value,
  enableDropCap = true,
  showTableOfContents = true,
  showEndMark = true,
}: EditorialPortableTextProps) => {
  const blocks = useMemo(() => normalizePortableText(value), [value]);

  // Identify the first real body paragraph for the Drop Cap
  const firstBodyParaKey = useMemo(() => {
    if (!enableDropCap) return null;
    const found = blocks.find((b) => {
      if (b._type !== "block" || (b.style && b.style !== "normal") || b.listItem) {
        return false;
      }
      const txt = (b.children || [])
        .map((c) => c?.text || "")
        .join("")
        .trim();
      return txt.length >= 60;
    });
    return found?._key ?? null;
  }, [blocks, enableDropCap]);

  // Identify the last real body paragraph for the classic magazine end-mark (■)
  const lastBodyParaKey = useMemo(() => {
    if (!showEndMark) return null;
    for (let i = blocks.length - 1; i >= 0; i--) {
      const b = blocks[i];
      if (b._type === "block" && (!b.style || b.style === "normal") && !b.listItem) {
        const txt = (b.children || [])
          .map((c) => c?.text || "")
          .join("")
          .trim();
        if (txt.length > 20) return b._key;
      }
    }
    return null;
  }, [blocks, showEndMark]);

  // Extract h2 section headings for Table of Contents jump bar
  const tocItems = useMemo(() => {
    const items: { id: string; text: string; key: string }[] = [];
    blocks.forEach((b, idx) => {
      if (b._type === "block" && b.style === "h2") {
        const text = (b.children || [])
          .map((c) => c?.text || "")
          .join("")
          .trim();
        if (text) {
          items.push({
            id: slugifyHeading(text, idx),
            text,
            key: b._key,
          });
        }
      }
    });
    return items;
  }, [blocks]);

  const headingIdByKey = useMemo(() => {
    const map = new Map<string, string>();
    tocItems.forEach((item) => map.set(item.key, item.id));
    return map;
  }, [tocItems]);

  const components: PortableTextComponents = useMemo(
    () => ({
      block: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        normal: ({ children, value: blockValue }: any) => {
          const isFirst = blockValue?._key && blockValue._key === firstBodyParaKey;
          const isLast = blockValue?._key && blockValue._key === lastBodyParaKey;

          return (
            <p
              className={
                isFirst
                  ? "editorial-dropcap mb-7 text-[1.1rem] sm:text-[1.18rem] leading-[1.88] text-foreground text-pretty"
                  : "mb-6 text-[1.05rem] sm:text-[1.125rem] leading-[1.88] text-foreground/90 text-pretty"
              }
            >
              {children}
              {isLast && (
                <span
                  className="inline-block ml-2 text-xs text-[hsl(var(--brand-red))] select-none align-middle"
                  aria-hidden="true"
                >
                  ■
                </span>
              )}
            </p>
          );
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        h2: ({ children, value: blockValue }: any) => {
          const id = blockValue?._key ? headingIdByKey.get(blockValue._key) : undefined;
          return (
            <h2
              id={id}
              className="mt-12 mb-5 scroll-mt-28 font-serif text-2xl sm:text-[1.7rem] font-bold leading-[1.22] tracking-tight text-foreground text-balance border-l-4 border-[hsl(var(--brand-red))] pl-4 py-0.5"
            >
              {children}
            </h2>
          );
        },
        h3: ({ children }) => (
          <h3 className="mt-8 mb-3 scroll-mt-28 font-serif text-lg sm:text-xl font-bold tracking-tight text-foreground text-balance flex items-center gap-2.5">
            <span className="h-2 w-2 bg-[hsl(var(--brand-red))] shrink-0" aria-hidden="true" />
            <span>{children}</span>
          </h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-8 border-l-4 border-[hsl(var(--brand-red))] bg-secondary/50 py-4 pl-6 pr-5 font-serif text-xl sm:text-2xl italic leading-snug text-foreground text-pretty">
            {children}
          </blockquote>
        ),
        caption: ({ children }) => (
          <p className="my-5 border-l-2 border-primary/50 bg-secondary/40 px-4 py-2 text-xs sm:text-[13px] italic leading-relaxed text-muted-foreground">
            {children}
          </p>
        ),
      },
      marks: {
        strong: ({ children }) => (
          <strong className="font-bold text-foreground">{children}</strong>
        ),
        em: ({ children }) => <em className="italic text-foreground/95">{children}</em>,
        underline: ({ children }) => (
          <span className="underline-mark underline decoration-primary/45 decoration-1 underline-offset-4">
            {children}
          </span>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        link: ({ value: linkVal, children }: any) => (
          <a
            href={linkVal?.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline decoration-primary/60 decoration-1 underline-offset-4 hover:text-[hsl(var(--brand-red))] hover:decoration-[hsl(var(--brand-red))] transition-colors"
          >
            {children}
          </a>
        ),
      },
      types: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image: ({ value: imgVal }: any) => (
          <figure className="my-10 overflow-hidden border border-border bg-muted/30 shadow-sm">
            <img
              src={urlFor(imgVal).width(1200).auto("format").url()}
              alt={imgVal.alt || ""}
              className="w-full max-h-[640px] object-contain mx-auto"
              loading="lazy"
            />
            {imgVal.alt && (
              <figcaption className="border-t border-border bg-secondary/50 px-4 py-2.5 text-center text-xs text-muted-foreground italic">
                {imgVal.alt}
              </figcaption>
            )}
          </figure>
        ),
      },
      list: {
        bullet: ({ children }) => (
          <ul className="mb-6 ml-5 list-disc space-y-2.5 text-[1.05rem] sm:text-[1.125rem] leading-[1.8] text-foreground/90 marker:text-[hsl(var(--brand-red))]">
            {children}
          </ul>
        ),
        number: ({ children }) => (
          <ol className="mb-6 ml-5 list-decimal space-y-2.5 text-[1.05rem] sm:text-[1.125rem] leading-[1.8] text-foreground/90 marker:font-bold marker:text-[hsl(var(--brand-red))]">
            {children}
          </ol>
        ),
      },
      listItem: {
        bullet: ({ children }) => <li className="pl-1 text-pretty">{children}</li>,
        number: ({ children }) => <li className="pl-1 text-pretty">{children}</li>,
      },
    }),
    [firstBodyParaKey, lastBodyParaKey, headingIdByKey]
  );

  return (
    <div className="editorial-prose">
      {showTableOfContents && tocItems.length >= 3 && (
        <nav
          aria-label="In this dispatch"
          className="mb-10 border border-border bg-secondary/45 p-5 sm:p-6"
          style={{ borderLeft: "3px solid hsl(var(--brand-red))" }}
        >
          <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--brand-red))]">
            <ListOrdered className="h-3.5 w-3.5" />
            In This Dispatch
          </div>
          <ol className="grid gap-2 sm:grid-cols-2">
            {tocItems.map((item, idx) => (
              <li key={item.id} className="flex items-baseline gap-2 text-xs sm:text-sm">
                <span className="font-serif font-bold text-[hsl(var(--brand-red))] tabular-nums shrink-0">
                  {String(idx + 1).padStart(2, "0")}.
                </span>
                <a
                  href={`#${item.id}`}
                  className="font-medium text-foreground/85 hover:text-primary transition-colors line-clamp-1"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <PortableText value={blocks} components={components} />
    </div>
  );
};
