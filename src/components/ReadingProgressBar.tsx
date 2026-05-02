import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export const ReadingProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const smoothProgress = useSpring(progress, { stiffness: 200, damping: 30 });
  const width = useTransform(smoothProgress, [0, 100], ["0%", "100%"]);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent">
      <motion.div
        className="h-full bg-[hsl(var(--brand-red))] origin-left"
        style={{ width }}
      />
    </div>
  );
};