import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/PageTransition";
import { ThemeProvider } from "@/context/ThemeContext";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Topics from "./pages/Topics.tsx";
import Interview from "./pages/Interview.tsx";
import About from "./pages/About.tsx";
import Magazine from "./pages/Magazine.tsx";
import Social from "./pages/Social.tsx";
import Article from "./pages/Article.tsx";
import Search from "./pages/Search.tsx";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/topics/:category" element={<Topics />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/about/:section" element={<About />} />
          <Route path="/magazine" element={<Magazine />} />
          <Route path="/social" element={<Social />} />
          <Route path="/article/:slug" element={<Article />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
};

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;