import { useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, FreeMode } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/autoplay";

// This interface defines the data we will pass from Index.tsx
export interface TopicCardData {
  id: string | number;
  category: string;
  slug: string; // The URL slug (e.g., "international", "cover-story")
  title: string;
  excerpt?: string;
  author: string;
  date: string;
  image: string;
  colorClass?: string; // Optional: to theme tags (e.g., bg-red-700)
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
    <div className={cn("relative w-full group", className)}>
      {/* Custom Navigation Arrows */}
      <div className="absolute right-0 -top-12 hidden gap-2 sm:flex">
        <button
          ref={prevRef}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all hover:bg-foreground hover:text-background disabled:opacity-30 disabled:hover:bg-background disabled:hover:text-foreground z-10"
          aria-label="Previous topics"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          ref={nextRef}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all hover:bg-foreground hover:text-background disabled:opacity-30 disabled:hover:bg-background disabled:hover:text-foreground z-10"
          aria-label="Next topics"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <Swiper
        modules={[Autoplay, Navigation, FreeMode]}
        spaceBetween={24}
        slidesPerView={1.2}
        freeMode={true}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true, // Pauses scroll when mouse hovers over a card
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          // Re-bind custom navigation refs after init
          if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }
        }}
        breakpoints={{
          480: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3.5 },
        }}
        className="w-full pb-8"
      >
        {topics.map((topic) => (
          <SwiperSlide key={topic.id} className="h-auto">
            <div className="group/card flex h-full flex-col overflow-hidden border border-foreground/20 bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              
              {/* Thumbnail Image */}
              <Link to={`/topics/${topic.slug}`} className="relative aspect-[16/10] w-full overflow-hidden block">
                <img
                  src={topic.image}
                  alt={topic.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                />
                <div className="absolute top-3 left-3 z-10">
                  <span className={cn(
                    "inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white",
                    topic.colorClass || "bg-[#1974D1]" // Defaults to Global Doctrine Blue
                  )}>
                    {topic.category}
                  </span>
                </div>
              </Link>

              {/* Card Content */}
              <div className="flex flex-1 flex-col p-5">
                <Link to={`/topics/${topic.slug}`} className="mb-3 block">
                  <h3 className="font-playfair text-lg font-bold leading-tight text-foreground transition-colors group-hover/card:text-[#1974D1] line-clamp-2">
                    {topic.title}
                  </h3>
                </Link>
                
                <div className="mt-auto border-t border-border/50 pt-4 flex flex-col gap-3">
                  {/* Meta Data */}
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground tracking-wide">
                    <span className="font-semibold text-foreground">{topic.author}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                    <span>{topic.date}</span>
                  </div>

                  {/* Read More Link */}
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