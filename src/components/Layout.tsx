import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const Layout = ({ children }: { children: ReactNode }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: "easeOut",
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      className="flex min-h-screen flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Navbar />
      <motion.main className="flex-1" variants={itemVariants}>
        {children}
      </motion.main>
      <Footer />
    </motion.div>
  );
};
