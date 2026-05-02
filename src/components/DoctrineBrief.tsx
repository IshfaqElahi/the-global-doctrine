import { useState, useEffect, useRef } from "react";
import { Send, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";

const TOPICS = [
  "General Geopolitics",
  "Middle East",
  "Asia & Indo-Pacific",
  "Europe & NATO",
  "The Americas",
  "Global Economy",
  "Free Writing"
];

export const DoctrineBrief = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "General Geopolitics",
    brief: "",
  });

  // Trigger entrance animation on load
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      setFormData({ name: "", email: "", topic: "General Geopolitics", brief: "" });
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="border-t border-border bg-background py-16 lg:py-24 transition-colors duration-300 overflow-hidden">
      <div className="container-editorial">
        {/* INVERTED FORM WRAPPER with Entrance Animation */}
        <div 
          className={`mx-auto max-w-3xl bg-foreground text-background p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.07)] border border-foreground/10 transition-all duration-1000 ease-out transform ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          
          {/* Header */}
          <div className="text-center mb-10 overflow-hidden">
            <h2 className="text-[hsl(var(--brand-red))] font-bold uppercase tracking-[0.15em] text-sm sm:text-base mb-4">
              The Doctrine Brief
            </h2>
            <p className="font-serif text-[1.15rem] sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight whitespace-nowrap text-background mb-4">
              GEOPOLITICS WITHOUT GATEKEEPING.
            </p>
            <p className="text-background/70 text-base sm:text-lg">
              Your voice matters. Send us your best thinking.
            </p>
          </div>

          {/* Animated Status Messages */}
          <div 
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              status !== "idle" ? "max-h-24 opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"
            }`}
          >
            {status === "success" && (
              <div className="flex items-center gap-3 bg-green-500/20 border border-green-500/30 text-green-400 p-4 rounded-sm">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">Your brief has been securely transmitted to the editorial team. Thank you.</p>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-3 bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">Connection error. Please check your network and try sending your brief again.</p>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5 group">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-background/70 transition-colors group-focus-within:text-primary">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="How should we credit you?"
                  className="w-full bg-transparent border border-background/20 px-4 py-3 text-background placeholder:text-background/40 focus:border-primary focus:bg-background/5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
              </div>

              <div className="space-y-1.5 group">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-background/70 transition-colors group-focus-within:text-primary">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="w-full bg-transparent border border-background/20 px-4 py-3 text-background placeholder:text-background/40 focus:border-primary focus:bg-background/5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Custom Animated Dropdown */}
            <div className="space-y-1.5" ref={dropdownRef}>
              <label className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDropdownOpen ? "text-primary" : "text-background/70"}`}>
                Subject Region / Topic
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full bg-transparent border px-4 py-3 text-left text-background focus:outline-none transition-all duration-300 flex justify-between items-center ${
                    isDropdownOpen ? "border-primary bg-background/5 ring-2 ring-primary/20" : "border-background/20 hover:border-background/40"
                  }`}
                >
                  {formData.topic}
                  <ChevronDown className={`h-4 w-4 text-background/70 transition-transform duration-500 ease-in-out ${isDropdownOpen ? "rotate-180 text-primary" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                <div 
                  className={`absolute z-10 w-full mt-1 bg-foreground border border-background/10 shadow-2xl transition-all duration-300 origin-top ${
                    isDropdownOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
                  }`}
                >
                  <div className="max-h-60 overflow-y-auto py-1">
                    {TOPICS.map((topic) => (
                      <div
                        key={topic}
                        onClick={() => {
                          setFormData({ ...formData, topic });
                          setIsDropdownOpen(false);
                        }}
                        className={`px-4 py-3 text-sm cursor-pointer transition-colors duration-200 ${
                          formData.topic === topic ? "bg-primary text-white" : "text-background hover:bg-background/10 hover:text-primary"
                        }`}
                      >
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 group">
              <label htmlFor="brief" className="text-xs font-bold uppercase tracking-wider text-background/70 transition-colors group-focus-within:text-primary">Your Brief</label>
              <textarea
                id="brief"
                name="brief"
                required
                rows={5}
                value={formData.brief}
                onChange={handleChange}
                placeholder="Share your analysis, intelligence, or opinion..."
                className="w-full bg-transparent border border-background/20 px-4 py-3 text-background placeholder:text-background/40 focus:border-primary focus:bg-background/5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-y"
              />
            </div>

            {/* Red to Blue Hover Effect */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[hsl(var(--brand-red))] py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all duration-500 ease-out hover:bg-primary hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-foreground disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Transmitting..." : "Send"}
              <Send className={`h-4 w-4 transition-transform duration-500 ${isSubmitting ? "translate-x-12 opacity-0" : ""}`} />
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};