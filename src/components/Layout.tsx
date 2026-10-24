import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
    <ScrollToTop />
    <Navbar />
    <motion.main
      className="flex-1"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.main>
    <Footer />
  </div>
);
