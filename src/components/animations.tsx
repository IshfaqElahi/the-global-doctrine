import { motion } from "framer-motion";
import { ReactNode } from "react";

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: "easeOut",
      duration: 0.4,
    },
  },
};

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedList = ({ children, className }: AnimatedListProps) => (
  <motion.div
    className={className}
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {children}
  </motion.div>
);

interface AnimatedListItemProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedListItem = ({
  children,
  className,
}: AnimatedListItemProps) => (
  <motion.div className={className} variants={itemVariants}>
    {children}
  </motion.div>
);
