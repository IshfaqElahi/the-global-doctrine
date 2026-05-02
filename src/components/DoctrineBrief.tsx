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
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9VqnrQSHdrRnp6-otqEpLjjonP2rUWY9arwJ2iH8F00R6JRNHj2umpiaYbbEBr6OT/exec"; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(formData),
      });

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
    <section className="border-t border-border bg-background py-16 lg:py-24 transition-colors duration-300">
      <div className="container-editorial">
        {/* INVERTED FORM WRAPPER - Dark in Light Mode, White in Dark Mode */}
        <div className="mx-auto max-w-3xl bg-foreground text-background p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.07)] border border-foreground/10 transition-colors duration-300">
          
          {/* Header */}
          <div className="text-center mb-10 overflow-hidden">
            <h2 className="text-[hsl(var(--brand-red))] font-bold uppercase tracking-[0.15em] text-sm sm:text-base mb-4">
              The Doctrine Brief
            </h2>
            {/* Capitalized, Single Line, Responsive Text Size */}
            <p className="font-serif text-[1.15rem] sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight whitespace-nowrap text-background mb-4">
              GEOPOLITICS WITHOUT GATEKEEPING.
            </p>
            <p className="text-background/70 text-base sm:text-lg">
              Your voice matters. Send us your best thinking.
            </p>
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="mb-8 flex items-center gap-3 bg-green-500/20 border border-green-500/30 text-green-400 p-4 rounded-sm">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm font-medium">Your brief has been securely transmitted to the editorial team. Thank you.</p>
            </div>
          )}

          {status === "error" && (
            <div className="mb-8 flex items-center gap-3 bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-sm">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">Connection error. Please check your network and try sending your brief again.</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-background/70">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="How should we credit you?"
                  className="w-full bg-transparent border border-background/20 px-4 py-3 text-background placeholder:text-background/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-background/70">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="w-full bg-transparent border border-background/20 px-4 py-3 text-background placeholder:text-background/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="topic" className="text-xs font-bold uppercase tracking-wider text-background/70">Subject Region / Topic</label>
              <select
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full bg-transparent border border-background/20 px-4 py-3 text-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="General" className="bg-foreground text-background">General Geopolitics</option>
                <option value="Middle East" className="bg-foreground text-background">Middle East</option>
                <option value="Asia" className="bg-foreground text-background">Asia & Indo-Pacific</option>
                <option value="Europe" className="bg-foreground text-background">Europe & NATO</option>
                <option value="Americas" className="bg-foreground text-background">The Americas</option>
                <option value="Economy" className="bg-foreground text-background">Global Economy</option>
                <option value="Free Writing" className="bg-foreground text-background">Free Writing</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="brief" className="text-xs font-bold uppercase tracking-wider text-background/70">Your Brief</label>
              <textarea
                id="brief"
                name="brief"
                required
                rows={5}
                value={formData.brief}
                onChange={handleChange}
                placeholder="Share your analysis, intelligence, or opinion..."
                className="w-full bg-transparent border border-background/20 px-4 py-3 text-background placeholder:text-background/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-y"
              />
            </div>

            {/* Red to Blue Hover Effect */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[hsl(var(--brand-red))] py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-foreground disabled:opacity-70 disabled:cursor-not-allowed"
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