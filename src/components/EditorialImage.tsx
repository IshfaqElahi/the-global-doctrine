import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import heroImg from "@/assets/hero-summit.webp";

export interface EditorialImageProps {
  src?: string | null;
  alt: string;
  aspectClassName?: string;
  className?: string;
  imgClassName?: string;
  variant?: "card" | "hero" | "portrait" | "feature";
  priority?: boolean;
  width?: number;
}

/**
 * Extracts aspect ratio (width / height) directly from Sanity asset URLs
 * e.g. "...-1638x2048.jpg" -> 0.8
 */
const parseSanityAspectRatio = (url?: string | null): number | null => {
  if (!url) return null;
  const match = url.match(/-(\d+)x(\d+)\.[a-zA-Z0-9]+/);
  if (!match) return null;
  const w = parseInt(match[1], 10);
  const h = parseInt(match[2], 10);
  if (!w || !h) return null;
  return w / h;
};

/**
 * Appends Sanity CDN transformation params cleanly if it's a Sanity CDN URL
 */
export const optimizeSanityUrl = (url?: string | null, width = 900, quality = 82): string => {
  if (!url) return heroImg;
  if (!url.includes("cdn.sanity.io")) return url;
  const baseUrl = url.split("?")[0];
  return `${baseUrl}?auto=format&w=${width}&q=${quality}&fit=max`;
};

export const EditorialImage = ({
  src,
  alt,
  aspectClassName,
  className,
  imgClassName,
  variant = "card",
  priority = false,
  width = 900,
}: EditorialImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [naturalRatio, setNaturalRatio] = useState<number | null>(null);

  const urlRatio = useMemo(() => parseSanityAspectRatio(src), [src]);
  const ratio = naturalRatio ?? urlRatio;

  const finalSrc = useMemo(() => {
    if (error || !src) return heroImg;
    return optimizeSanityUrl(src, variant === "hero" || variant === "feature" ? 1600 : width);
  }, [src, error, variant, width]);

  const ambientSrc = useMemo(() => {
    if (error || !src) return heroImg;
    return optimizeSanityUrl(src, 240, 50);
  }, [src, error]);

  // Determine whether the image needs ambient containment to prevent cutting off graphics/posters/faces
  const needsContain = useMemo(() => {
    if (variant === "hero" || variant === "feature") {
      // In hero or feature view, always preserve full composition if portrait, square, or very wide
      if (!ratio) return true;
      return ratio < 1.28 || ratio > 2.0;
    }
    if (variant === "portrait") {
      // Portrait container (4:5 = 0.8): contain if image is much wider (landscape/square > 0.95)
      if (!ratio) return false;
      return ratio > 0.95;
    }
    // Standard card container (16:10 = 1.6 or 4:3 = 1.33):
    // Contain if image is portrait/square (< 1.18) or ultra-wide banner (> 1.98)
    if (!ratio) return false;
    return ratio < 1.18 || ratio > 1.98;
  }, [ratio, variant]);

  const defaultAspect =
    variant === "hero"
      ? "aspect-[4/3] sm:aspect-[16/11] lg:aspect-[5/4] max-h-[580px]"
      : variant === "portrait"
      ? "aspect-[4/5]"
      : variant === "feature"
      ? "aspect-[4/3] sm:aspect-[16/9] max-h-[640px]"
      : "aspect-[16/10]";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-muted select-none",
        aspectClassName ?? defaultAspect,
        className
      )}
    >
      {/* Shimmer placeholder until loaded */}
      {!loaded && <div className="absolute inset-0 skeleton z-0" />}

      {/* Ambient blurred background layer so portrait/square posters or wide banners have zero awkward empty bars */}
      {needsContain && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
          <img
            src={ambientSrc}
            alt=""
            className="h-full w-full object-cover scale-125 blur-2xl opacity-55 dark:opacity-45 brightness-75 saturate-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-black/25" />
        </div>
      )}

      {/* Crisp main image */}
      <img
        src={finalSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            setNaturalRatio(img.naturalWidth / img.naturalHeight);
          }
          setLoaded(true);
        }}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        className={cn(
          "relative z-10 h-full w-full transition-all duration-700 ease-out",
          needsContain
            ? "object-contain p-1 sm:p-2 drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
            : "object-cover object-center",
          "group-hover:scale-[1.035] group-hover/card:scale-[1.035]",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName
        )}
      />

      {/* Subtle inner editorial border */}
      <div className="pointer-events-none absolute inset-0 z-20 ring-1 ring-inset ring-black/10 dark:ring-white/10" />
    </div>
  );
};
