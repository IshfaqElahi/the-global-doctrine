import { Link } from "react-router-dom";

export const Logo = ({ compact = false }: { compact?: boolean }) => (
  <Link to="/" className="group inline-flex items-center gap-2" aria-label="The Global Doctrine — Home">
    <img src="/logo.svg" alt="The Global Doctrine Logo" className="h-10 w-10 object-contain" />
    {!compact && (
      <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
        <span className="text-foreground group-[.footer-logo]:text-background">The Global </span>
        <span className="text-[hsl(var(--brand-red))]">Doctrine</span>
      </span>
    )}
  </Link>
);