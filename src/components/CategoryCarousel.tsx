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
        <button ref={prevRef}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background text-primary transition-all hover:bg-primary hover:text-white shadow-sm"
          aria-label="Previous">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button ref={nextRef}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background text-primary transition-all hover:bg-primary hover:text-white shadow-sm"
          aria-label="Next">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={20}
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
            <div className="group/card flex w-full flex-col overflow-hidden bg-background border border-border shadow-md hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/50 transition-all duration-300"
              style={{ borderLeft: "3px solid hsl(var(--brand-red))" }}>

              {/* Image */}
              <Link to={`/topics/${topic.slug}`} className="relative block w-full overflow-hidden" style={{ paddingBottom: "62.5%" }}>
                <img src={topic.image} alt={topic.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 z-10">
                  <span className={cn(
                    "inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm",
                    topic.colorClass || "bg-[#1974D1]"
                  )}>
                    {topic.category}
                  </span>
                </div>
              </Link>

              {/* Card body */}
              <div className="flex flex-1 flex-col p-5 bg-background">
                <Link to={`/topics/${topic.slug}`} className="mb-3 block flex-1">
                  <h3 className="font-serif text-lg font-bold leading-snug text-foreground transition-colors group-hover/card:text-primary line-clamp-3">
                    {topic.title}
                  </h3>
                </Link>
                <div className="mt-auto border-t border-border/50 pt-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="font-semibold text-foreground truncate">{topic.author}</span>
                    <span className="h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span className="truncate">{topic.date}</span>
                  </div>
                  <Link to={`/topics/${topic.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary transition-all hover:gap-2.5 hover:text-[hsl(var(--brand-red))]">
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