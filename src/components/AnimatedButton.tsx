import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button as UIButton } from "@/components/ui/button";

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg";
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const AnimatedButton = ({
  children,
  variant = "default",
  size = "default",
  onClick,
  className,
  type = "button",
  disabled = false,
}: AnimatedButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <UIButton
        variant={variant}
        size={size}
        onClick={onClick}
        className={className}
        type={type}
        disabled={disabled}
      >
        {children}
      </UIButton>
    </motion.div>
  );
};
