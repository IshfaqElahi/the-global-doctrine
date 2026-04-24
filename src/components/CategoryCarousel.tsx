import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/data/articles";

interface CategoryCarouselProps {
  categories: Category[];
  onCategoryChange?: (category: Category) => void;
  defaultCategory?: Category;
  showArrows?: boolean;
  autoScroll?: boolean;
  pauseOnHover?: boolean;
}

export const CategoryCarousel = ({
  categories,
  onCategoryChange,
  defaultCategory = "Cover Story",
  showArrows = true,
  autoScroll = false,
  pauseOnHover = true,
}: CategoryCarouselProps) => {
  const [activeCategory, setActiveCategory] = useState<Category>(defaultCategory);
  const [isScrolling, setIsScrolling] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Check scroll position
  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Smooth scroll function
  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const scrollAmount = 300; // pixels to scroll
    const targetScroll = containerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);

    setIsScrolling(true);
    containerRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });

    // Reset scrolling state after animation
    setTimeout(() => {
      setIsScrolling(false);
      checkScroll();
    }, 300);
  };

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50; // minimum distance for swipe
    const difference = touchStartX.current - touchEndX.current;

    if (Math.abs(difference) > swipeThreshold) {
      if (difference > 0) {
        // Swiped left, scroll right
        scroll("right");
      } else {
        // Swiped right, scroll left
        scroll("left");
      }
    }
  };

  // Monitor scroll position
  useEffect(() => {
    checkScroll();
    const handleScroll = () => checkScroll();
    const handleResize = () => checkScroll();

    const currentContainer = containerRef.current;
    currentContainer?.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      currentContainer?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll || isHovering) return;

    const interval = setInterval(() => {
      if (!containerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        // Reset to start
        containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroll("right");
      }
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, [autoScroll, isHovering]);

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category);
    onCategoryChange?.(category);

    // Scroll the clicked item into view
    const element = document.getElementById(`category-${category}`);
    if (element && containerRef.current) {
      const elementOffset = element.offsetLeft;
      const elementWidth = element.offsetWidth;
      const containerWidth = containerRef.current.clientWidth;
      const scrollPosition = elementOffset - (containerWidth - elementWidth) / 2;

      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .carousel-item {
          animation: slideIn 0.3s ease-out forwards;
        }

        .carousel-item:nth-child(odd) {
          animation: slideInRight 0.3s ease-out forwards;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .category-btn {
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateZ(0);
        }

        .category-btn:not(:disabled):hover {
          transform: translateY(-2px);
        }

        .category-btn.active {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div
        className="relative flex w-full items-center gap-2 sm:gap-4"
        onMouseEnter={() => pauseOnHover && setIsHovering(true)}
        onMouseLeave={() => pauseOnHover && setIsHovering(false)}
      >
        {/* Left Arrow */}
        {showArrows && canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            disabled={isScrolling}
            className={cn(
              "absolute -left-12 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center",
              "rounded-full border border-border bg-background transition-all duration-200",
              "hover:border-foreground hover:bg-foreground hover:text-background",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "hidden sm:flex"
            )}
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {/* Carousel Container */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full overflow-x-auto scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="flex gap-2 sm:gap-3">
            {categories.map((category, index) => (
              <button
                key={category}
                id={`category-${category}`}
                onClick={() => handleCategoryClick(category)}
                className={cn(
                  "carousel-item whitespace-nowrap px-3 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider",
                  "border transition-all duration-300 ease-in-out",
                  "flex-shrink-0",
                  "category-btn",
                  activeCategory === category
                    ? "border-foreground bg-foreground text-background shadow-md active"
                    : "border-border bg-background text-foreground hover:border-foreground hover:bg-secondary",
                  "focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
                )}
                style={{
                  animationDelay: `${index * 30}ms`,
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        {showArrows && canScrollRight && (
          <button
            onClick={() => scroll("right")}
            disabled={isScrolling}
            className={cn(
              "absolute -right-12 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center",
              "rounded-full border border-border bg-background transition-all duration-200",
              "hover:border-foreground hover:bg-foreground hover:text-background",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "hidden sm:flex"
            )}
            aria-label="Scroll categories right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </>
  );
};
