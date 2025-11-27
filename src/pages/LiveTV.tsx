import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tv } from "lucide-react";

const LiveTV = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-[70px] md:mt-0">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Tv className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">TV en Direct</h1>
            </div>
            <p className="text-muted-foreground">Regardez OREDY MEDIA TV en direct</p>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden">
                {/* Placeholder pour le player vidéo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Tv className="h-16 w-16 text-white/50 mx-auto" />
                    <p className="text-white/70">Player TV en direct</p>
                    <p className="text-white/50 text-sm">Intégrez votre flux vidéo ici</p>
                  </div>
                </div>
                
                {/* Exemple d'intégration iframe pour un flux vidéo
                <iframe
                  src="YOUR_VIDEO_STREAM_URL"
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
                */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">À propos d'OREDY MEDIA TV</h2>
              <p className="text-muted-foreground">
                Retrouvez en direct toute la programmation d'OREDY MEDIA TV.
                Des émissions d'actualité, culturelles, éducatives et de divertissement 
                pour rester informé et connecté avec votre communauté.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LiveTV;
