export const calcReadTime = (blocks: { _type: string; children?: { text: string }[] }[]): number => {
  if (!blocks?.length) return 0;
  const text = blocks
    .filter((b) => b._type === "block")
    .flatMap((b) => b.children?.map((c) => c.text) ?? [])
    .join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};