import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface AnimatedLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export const AnimatedLink = ({ to, children, className }: AnimatedLinkProps) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Link to={to} className={className}>
        {children}
      </Link>
    </motion.div>
  );
};

interface AnimatedExternalLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export const AnimatedExternalLink = ({
  href,
  children,
  className,
  target = "_blank",
  rel = "noopener noreferrer",
}: AnimatedExternalLinkProps) => {
  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      className={className}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.a>
  );
};
