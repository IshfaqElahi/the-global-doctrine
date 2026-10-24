import { useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { EditorialImage } from "@/components/EditorialImage";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

export interface TopicCardData {
  id: string | number;
  category: string;
  slug: string;
  title: string;
  excerpt?: string;
  author: string;
  date: string;
  image: string;
  colorClass?: string;
}

interface CategoryCarouselProps {
  topics: TopicCardData[];
  className?: string;
}

export const CategoryCarousel = ({ topics, className }: CategoryCarouselProps) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  if (!topics || topics.length === 0) return null;

  return (
    <div className={cn("relative w-full", className)}>
      {/* Desktop Navigation (aligned in top-right of section header) */}
      <div className="absolute right-0 -top-[4.5rem] hidden gap-2.5 sm:flex z-10">
        <motion.button
          ref={prevRef}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="flex h-9 w-9 items-center justify-center border border-border bg-background text-foreground shadow-sm transition-colors hover:border-primary hover:bg-primary hover:text-white"
          aria-label="Previous category"
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>
        <motion.button
          ref={nextRef}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="flex h-9 w-9 items-center justify-center border border-border bg-background text-foreground shadow-sm transition-colors hover:border-primary hover:bg-primary hover:text-white"
          aria-label="Next category"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3800, disableOnInteraction: false, pauseOnMouseEnter: true }}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onInit={(swiper) => {
          if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }
        }}
        breakpoints={{
          520: { slidesPerView: 2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="w-full pb-4"
        style={{ alignItems: "stretch" }}
      >
        {topics.map((topic, index) => (
          <SwiperSlide key={topic.id} style={{ height: "auto", display: "flex" }}>
            <motion.div
              className="group/card editorial-card w-full"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Image with adaptive EditorialImage */}
              <Link
                to={`/topics/${topic.slug}`}
                className="relative block w-full overflow-hidden"
              >
                <EditorialImage
                  src={topic.image}
                  alt={topic.title}
                  variant="card"
                  aspectClassName="aspect-[16/10]"
                />
                <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/50 via-transparent to-black/15" />
                <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm",
                      topic.colorClass || "bg-primary"
                    )}
                  >
                    {topic.category}
                  </span>
                  <span className="font-serif text-xs font-bold text-white/80 bg-black/45 backdrop-blur-xs px-2 py-0.5 border border-white/15">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </Link>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5 bg-card">
                <Link to={`/topics/${topic.slug}`} className="mb-3 block flex-1">
                  <h3 className="article-title text-lg leading-snug line-clamp-2">
                    {topic.title}
                  </h3>
                </Link>
                <div className="mt-auto border-t border-border/60 pt-3.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground min-w-0">
                    <span className="font-semibold text-foreground truncate">
                      {topic.author}
                    </span>
                    {topic.date && (
                      <>
                        <span className="h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                        <span className="truncate">{topic.date}</span>
                      </>
                    )}
                  </div>
                  <Link
                    to={`/topics/${topic.slug}`}
                    className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-primary transition-all duration-200 group-hover/card:gap-2 group-hover/card:text-[hsl(var(--brand-red))]"
                  >
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Mobile navigation row */}
      <div className="mt-3 flex items-center justify-between sm:hidden">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          {topics.length} Editorial Desks
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => prevRef.current?.click()}
            className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground active:bg-primary active:text-white"
            aria-label="Previous category"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => nextRef.current?.click()}
            className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground active:bg-primary active:text-white"
            aria-label="Next category"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
