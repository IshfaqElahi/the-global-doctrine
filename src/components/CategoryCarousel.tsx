import { useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
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
      {/* Navigation Arrows */}
      <div className="absolute right-0 -top-12 hidden gap-2 sm:flex z-10">
        <button
          ref={prevRef}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all hover:bg-foreground hover:text-background disabled:opacity-30 z-10"
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          ref={nextRef}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all hover:bg-foreground hover:text-background disabled:opacity-30 z-10"
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
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
          480: { slidesPerView: 2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="w-full pb-4"
        style={{ alignItems: "stretch" }}
      >
        {topics.map((topic) => (
          <SwiperSlide key={topic.id} style={{ height: "auto", display: "flex" }}>
            <div className="group/card flex w-full flex-col overflow-hidden border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

              {/* Fixed-ratio image */}
              <Link to={`/topics/${topic.slug}`} className="relative block w-full overflow-hidden" style={{ paddingBottom: "62.5%" }}>
                <img
                  src={topic.image}
                  alt={topic.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                />
                <div className="absolute top-3 left-3 z-10">
                  <span className={cn(
                    "inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white",
                    topic.colorClass || "bg-[#1974D1]"
                  )}>
                    {topic.category}
                  </span>
                </div>
              </Link>

              {/* Card body — flex-1 makes all cards same height */}
              <div className="flex flex-1 flex-col p-5">
                <Link to={`/topics/${topic.slug}`} className="mb-3 block flex-1">
                  <h3 className="font-serif text-lg font-bold leading-snug text-foreground transition-colors group-hover/card:text-[#1974D1] line-clamp-3">
                    {topic.title}
                  </h3>
                </Link>

                <div className="mt-auto border-t border-border/50 pt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground tracking-wide">
                    <span className="font-semibold text-foreground truncate">{topic.author}</span>
                    <span className="h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span className="truncate">{topic.date}</span>
                  </div>
                  <Link
                    to={`/topics/${topic.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1974D1] transition-all hover:gap-2.5 hover:text-[#AD1115]"
                  >
                    Read More <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};