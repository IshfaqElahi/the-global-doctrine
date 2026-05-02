import { cn } from "@/lib/utils";

const Shimmer = ({ className }: { className?: string }) => (
  <div className={cn("skeleton rounded", className)} />
);

export const SkeletonCardCompact = () => (
  <div className="group border border-border bg-background shadow-sm" style={{ borderLeft: "3px solid hsl(var(--brand-red))" }}>
    <Shimmer className="aspect-[4/3] w-full rounded-none" />
    <div className="p-4 space-y-2">
      <Shimmer className="h-4 w-20" />
      <Shimmer className="h-5 w-full" />
      <Shimmer className="h-5 w-3/4" />
      <Shimmer className="h-3 w-28 mt-2" />
    </div>
  </div>
);

export const SkeletonCardHero = () => (
  <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
    <Shimmer className="aspect-[16/10] w-full lg:col-span-7 rounded-none" />
    <div className="flex flex-col justify-center lg:col-span-5 space-y-4">
      <Shimmer className="h-4 w-24" />
      <Shimmer className="h-12 w-full" />
      <Shimmer className="h-12 w-5/6" />
      <Shimmer className="h-5 w-full" />
      <Shimmer className="h-5 w-4/5" />
      <Shimmer className="h-5 w-3/5" />
      <Shimmer className="h-4 w-36 mt-2" />
    </div>
  </div>
);

export const SkeletonCarouselCard = () => (
  <div className="flex flex-col overflow-hidden border border-border bg-background shadow-sm" style={{ borderLeft: "3px solid hsl(var(--brand-red))" }}>
    <Shimmer className="aspect-[16/10] w-full rounded-none" />
    <div className="flex flex-1 flex-col p-5 space-y-3">
      <Shimmer className="h-5 w-full" />
      <Shimmer className="h-5 w-4/5" />
      <div className="mt-auto pt-4 border-t border-border/50 space-y-2">
        <Shimmer className="h-3 w-32" />
        <Shimmer className="h-3 w-16" />
      </div>
    </div>
  </div>
);