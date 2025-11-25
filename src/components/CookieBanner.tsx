import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import CookieSettings from "@/components/CookieSettings";
import { Cookie } from "lucide-react";

const CookieBanner = () => {
  const { hasConsented, showBanner, acceptAll, rejectAll } = useCookieConsent();
  const [showSettings, setShowSettings] = useState(false);

  if (hasConsented || !showBanner) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[100] bg-background border-t border-border shadow-2xl animate-in slide-in-from-bottom-5 duration-500">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 bg-primary/10 p-2 rounded-lg">
                <Cookie className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">Nous utilisons des cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Nous utilisons des cookies pour améliorer votre expérience de navigation, 
                  afficher des publicités personnalisées et analyser le trafic de notre site. 
                  En cliquant sur "Tout accepter", vous consentez à notre utilisation des cookies.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowSettings(true)}
                className="w-full sm:w-auto"
              >
                Personnaliser
              </Button>
              <Button
                variant="secondary"
                onClick={rejectAll}
                className="w-full sm:w-auto"
              >
                Refuser
              </Button>
              <Button
                onClick={acceptAll}
                className="w-full sm:w-auto"
              >
                Tout accepter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CookieSettings open={showSettings} onOpenChange={setShowSettings} />
    </>
  );
};

export default CookieBanner;
