import { Link } from "react-router-dom";

export const Logo = ({ compact = false }: { compact?: boolean }) => (
  <Link to="/" className="group inline-flex items-center gap-2" aria-label="The Global Doctrine — Home">
    <img src="/logo.png" alt="The Global Doctrine Logo" className="h-8 w-8 object-contain" />
    {!compact && (
      <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-foreground">
        The Global <span className="text-[hsl(var(--brand-red))]">Doctrine</span>
      </span>
    )}
  </Link>
);
