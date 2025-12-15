import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import panaRadioLogo from "@/assets/pana-radio-logo.png";

const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the prompt before
    const hasBeenDismissed = localStorage.getItem("pwa-prompt-dismissed");
    const dismissedTime = hasBeenDismissed ? parseInt(hasBeenDismissed, 10) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
    
    // Show prompt after 3 seconds if installable and not recently dismissed (within 7 days)
    if (isInstallable && !isInstalled && daysSinceDismissed > 7) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setIsVisible(false);
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  if (!isVisible || dismissed || isInstalled) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-center">
          <div className="w-20 h-20 mx-auto bg-white rounded-2xl p-2 shadow-lg mb-4">
            <img src={panaRadioLogo} alt="PANA RADIO" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-bold text-primary-foreground">Installer PANA RADIO</h2>
          <p className="text-primary-foreground/80 text-sm mt-1">Restez connecté à l'actualité</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                <Smartphone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Accès rapide</p>
                <p className="text-xs text-muted-foreground">Lancez l'app depuis votre écran d'accueil</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                <Download className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Léger et rapide</p>
                <p className="text-xs text-muted-foreground">Pas besoin de téléchargement lourd</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-2">
            <Button onClick={handleInstall} className="w-full" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Installer maintenant
            </Button>
            <Button onClick={handleDismiss} variant="ghost" className="w-full text-muted-foreground">
              Plus tard
            </Button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
