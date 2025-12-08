import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Article from "./pages/Article";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Categories from "./pages/Categories";
import Search from "./pages/Search";
import Team from "./pages/Team";
import Schedule from "./pages/Schedule";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import LiveTV from "./pages/LiveTV";
import Podcasts from "./pages/Podcasts";
import NotFound from "./pages/NotFound";
import MediaPlayer from "./components/MediaPlayer";
import CookieBanner from "./components/CookieBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:slug" element={<Article />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/contacts" element={<Contact />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/rechercher" element={<Search />} />
          <Route path="/equipe" element={<Team />} />
          <Route path="/programme" element={<Schedule />} />
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="/conditions" element={<Terms />} />
          <Route path="/tv-direct" element={<LiveTV />} />
          <Route path="/podcasts" element={<Podcasts />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <MediaPlayer />
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
