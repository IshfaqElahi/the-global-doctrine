import { Link } from "react-router-dom";

export const Logo = ({ compact = false }: { compact?: boolean }) => (
  <Link to="/" className="group inline-flex items-center gap-2" aria-label="The Global Doctrine — Home">
    <span className="flex h-8 w-8 items-center justify-center bg-[hsl(var(--brand-red))] text-brand-red-foreground font-serif text-lg font-bold leading-none">
      G
    </span>
    {!compact && (
      <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-foreground">
        The Global <span className="text-primary">Doctrine</span>
      </span>
    )}
  </Link>
);
