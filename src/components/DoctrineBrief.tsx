import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export const DoctrineBrief = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "General",
    brief: "",
  });

  // Your live Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw3rxjtjpNfbtX7UTOg2QpkG53zMKPMHQz8GJq61B40towd7jkAJ1iqB7nrDKqfnoQm/exec"; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Required to bypass Google's strict CORS policies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Since 'no-cors' masks the exact response, we assume success if no network error drops
      setStatus("success");
      setFormData({ name: "", email: "", topic: "General", brief: "" });
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="border-t border-border bg-secondary py-16 lg:py-24 transition-colors duration-300">
      <div className="container-editorial">
        <div className="mx-auto max-w-2xl bg-background border border-border p-8 sm:p-12 shadow-sm transition-colors duration-300">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-[hsl(var(--brand-red))] font-bold uppercase tracking-[0.15em] text-sm sm:text-base mb-4">
              The Doctrine Brief
            </h2>
            <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-4">
              Geopolitics without gatekeeping.
            </p>
            <p className="text-muted-foreground text-base sm:text-lg">
              Your voice matters. Send us your best thinking.
            </p>
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="mb-8 flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 p-4 rounded-sm">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm font-medium">Your brief has been securely transmitted to the editorial team. Thank you.</p>
            </div>
          )}

          {status === "error" && (
            <div className="mb-8 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-sm">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">Connection error. Please check your network and try sending your brief again.</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name / Alias</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="How should we credit you?"
                  className="w-full bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="w-full bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="topic" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject Region / Topic</label>
              <select
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full bg-transparent border border-border px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="General" className="bg-background">General Geopolitics</option>
                <option value="Middle East" className="bg-background">Middle East</option>
                <option value="Asia" className="bg-background">Asia & Indo-Pacific</option>
                <option value="Europe" className="bg-background">Europe & NATO</option>
                <option value="Americas" className="bg-background">The Americas</option>
                <option value="Economy" className="bg-background">Global Economy</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="brief" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Brief</label>
              <textarea
                id="brief"
                name="brief"
                required
                rows={5}
                value={formData.brief}
                onChange={handleChange}
                placeholder="Share your analysis, intelligence, or opinion..."
                className="w-full bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[hsl(var(--brand-red))] py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[hsl(var(--brand-red))/90] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-red))] focus:ring-offset-2 focus:ring-offset-background disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Transmitting..." : "Send"}
              {!isSubmitting && <Send className="h-4 w-4" />}
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};