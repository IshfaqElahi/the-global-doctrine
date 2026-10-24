export interface NormalizedBlock {
  _key: string;
  _type: string;
  style?: string;
  listItem?: string;
  level?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markDefs?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Cleans non-breaking spaces and stray whitespace from Sanity text strings
 * so words never glue together and cause ragged line wraps.
 */
export const cleanText = (str?: string | null): string => {
  if (!str) return "";
  return str
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Checks whether an excerpt is valid human text (filters out placeholder "---" strings)
 */
export const isValidExcerpt = (str?: string | null): boolean => {
  if (!str) return false;
  const cleaned = cleanText(str);
  if (!cleaned) return false;
  return !/^[-—_\s.]+$/.test(cleaned);
};

export const slugifyHeading = (text: string, idx: number): string => {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 48);
  return `section-${idx}-${base || "heading"}`;
};

/**
 * Preprocesses raw Sanity PortableText blocks:
 * 1. Strips empty / whitespace-only blocks so there are no blank vertical gaps.
 * 2. Replaces non-breaking spaces (\u00a0) pasted from Word/Google Docs with normal spaces.
 * 3. Splits single-block multi-paragraph walls of text (separated by \n) into proper paragraph blocks.
 * 4. Promotes standalone bold lines (entered as style="normal" with strong mark) into proper h2/h3 section headings.
 * 5. Promotes isolated single-item bullets used as section titles (e.g. in About page) into h2 headings.
 * 6. Detects standalone italic photo credits / captions and styles them as editorial captions.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizePortableText = (rawBlocks: any[]): NormalizedBlock[] => {
  if (!Array.isArray(rawBlocks)) return [];

  const expanded: NormalizedBlock[] = [];

  for (let i = 0; i < rawBlocks.length; i++) {
    const b = rawBlocks[i];
    if (!b) continue;

    if (b._type !== "block") {
      expanded.push(b);
      continue;
    }

    const rawChildren = Array.isArray(b.children) ? b.children : [];
    const cleanedChildren = rawChildren.map((c) =>
      typeof c?.text === "string"
        ? { ...c, text: c.text.replace(/\u00a0/g, " ") }
        : c
    );

    const fullText = cleanedChildren
      .map((c) => c?.text || "")
      .join("")
      .trim();

    // 1. Skip completely empty blocks
    if (!fullText) continue;

    // 2. Split multi-paragraph blocks pasted with newline breaks
    if (
      (!b.style || b.style === "normal") &&
      !b.listItem &&
      fullText.includes("\n")
    ) {
      const hasComplexMarks = cleanedChildren.some(
        (c) => Array.isArray(c?.marks) && c.marks.length > 0
      );
      const rawJoined = cleanedChildren.map((c) => c?.text || "").join("");
      const parts = rawJoined
        .split(/\n+/)
        .map((p) => p.replace(/\u00a0/g, " ").trim())
        .filter(Boolean);

      if (parts.length > 1 && !hasComplexMarks) {
        parts.forEach((partText, idx) => {
          expanded.push({
            ...b,
            _key: `${b._key || `blk-${i}`}-p${idx}`,
            style: "normal",
            children: [
              {
                _type: "span",
                _key: `${b._key || `sp-${i}`}-s${idx}`,
                marks: [],
                text: partText,
              },
            ],
          });
        });
        continue;
      } else if (parts.length === 1) {
        expanded.push({
          ...b,
          children: cleanedChildren.map((c) =>
            typeof c?.text === "string"
              ? { ...c, text: c.text.replace(/\n+/g, " ") }
              : c
          ),
        });
        continue;
      }
    }

    expanded.push({
      ...b,
      children: cleanedChildren,
    });
  }

  // Second pass: classify headings, captions, and isolated bullets
  const normalized: NormalizedBlock[] = [];

  for (let i = 0; i < expanded.length; i++) {
    const b = expanded[i];
    if (b._type !== "block") {
      normalized.push(b);
      continue;
    }

    const children = Array.isArray(b.children) ? b.children : [];
    const nonEmpty = children.filter((c) => c?.text && c.text.trim().length > 0);
    const fullText = children
      .map((c) => c?.text || "")
      .join("")
      .trim();

    // Skip redundant "Introduction" label at the very first block
    if (i === 0 && /^introduction$/i.test(fullText)) {
      continue;
    }

    const allStrong =
      nonEmpty.length > 0 &&
      nonEmpty.every((c) => Array.isArray(c.marks) && c.marks.includes("strong"));
    const allEm =
      nonEmpty.length > 0 &&
      nonEmpty.every((c) => Array.isArray(c.marks) && c.marks.includes("em"));

    // Standalone italic photo caption / credit line
    if (
      (!b.style || b.style === "normal") &&
      !b.listItem &&
      allEm &&
      !allStrong &&
      fullText.length <= 130 &&
      (fullText.includes("©") ||
        fullText.includes("|") ||
        /^photo/i.test(fullText) ||
        /^credit/i.test(fullText) ||
        /^source/i.test(fullText))
    ) {
      normalized.push({
        ...b,
        style: "caption",
        children: [{ _type: "span", _key: `${b._key}-cap`, marks: [], text: fullText }],
      });
      continue;
    }

    // Standalone bold subheading entered as a normal paragraph
    const endsWithPeriod = /\.$/.test(fullText) && !/\.\.\.$/.test(fullText);
    if (
      (!b.style || b.style === "normal") &&
      !b.listItem &&
      allStrong &&
      fullText.length <= 95 &&
      !endsWithPeriod
    ) {
      const isSubtopicLabel =
        fullText.length <= 18 &&
        !/[?:!]/.test(fullText) &&
        fullText !== fullText.toUpperCase() &&
        !/deal|situation|conclusion|where|how|why|history|hostility|overview/i.test(fullText);

      normalized.push({
        ...b,
        style: isSubtopicLabel ? "h3" : "h2",
        children: [{ _type: "span", _key: `${b._key}-hd`, marks: [], text: fullText }],
      });
      continue;
    }

    // If already h2/h3 in Sanity, strip redundant strong mark inside the heading
    if (b.style === "h2" || b.style === "h3") {
      normalized.push({
        ...b,
        children: [{ _type: "span", _key: `${b._key}-cleanhd`, marks: [], text: fullText }],
      });
      continue;
    }

    // Isolated single-item bullet used as a section heading (e.g. Who We Are page)
    if (b.listItem === "bullet" && fullText.length <= 75 && !endsWithPeriod) {
      const prev = expanded[i - 1];
      const next = expanded[i + 1];
      const prevIsList = prev && prev.listItem === "bullet";
      const nextIsList = next && next.listItem === "bullet";
      if (!prevIsList && !nextIsList) {
        normalized.push({
          ...b,
          listItem: undefined,
          level: undefined,
          style: "h2",
          children: [{ _type: "span", _key: `${b._key}-bhd`, marks: [], text: fullText }],
        });
        continue;
      }
    }

    normalized.push(b);
  }

  return normalized;
};
