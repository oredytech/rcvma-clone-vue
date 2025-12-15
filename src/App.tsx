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
import PodcastPlayer from "./pages/PodcastPlayer";
import NotFound from "./pages/NotFound";
import MediaPlayer from "./components/MediaPlayer";
import CookieBanner from "./components/CookieBanner";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import NotificationPrompt from "./components/NotificationPrompt";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
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
          <Route path="/podcast/:slug" element={<PodcastPlayer />} />
          {/* Route dynamique pour les articles - doit être en dernier */}
          <Route path="/:slug" element={<Article />} />
        </Routes>
        <MediaPlayer />
        <CookieBanner />
        <PWAInstallPrompt />
        <NotificationPrompt />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
