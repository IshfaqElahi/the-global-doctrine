import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Topics from "./pages/Topics.tsx";
import Interview from "./pages/Interview.tsx";
import About from "./pages/About.tsx";
import Magazine from "./pages/Magazine.tsx";
import Social from "./pages/Social.tsx";
import Article from "./pages/Article.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/topics/:category" element={<Topics />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/about/:section" element={<About />} />
          <Route path="/magazine" element={<Magazine />} />
          <Route path="/social" element={<Social />} />
          <Route path="/article/:slug" element={<Article />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
