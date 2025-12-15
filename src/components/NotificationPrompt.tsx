import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const NotificationPrompt = () => {
  const { isSupported, permission, isSubscribed, requestPermission } = usePushNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the prompt before
    const hasBeenDismissed = localStorage.getItem("notification-prompt-dismissed");
    const dismissedTime = hasBeenDismissed ? parseInt(hasBeenDismissed, 10) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
    
    // Show prompt after 10 seconds if supported, not subscribed, and not recently dismissed
    if (isSupported && permission === 'default' && !isSubscribed && daysSinceDismissed > 3) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, permission, isSubscribed]);

  const handleEnable = async () => {
    await requestPermission();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setIsVisible(false);
    localStorage.setItem("notification-prompt-dismissed", Date.now().toString());
  };

  if (!isVisible || dismissed || !isSupported || permission !== 'default') {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[90] animate-in slide-in-from-bottom duration-300">
      <div className="bg-background border border-border rounded-xl shadow-lg p-4">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2.5 rounded-full flex-shrink-0">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 pr-4">
            <h3 className="font-semibold text-foreground text-sm">Activer les notifications</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Recevez les dernières actualités et émissions en direct de PANA RADIO.
            </p>
            <div className="flex gap-2 mt-3">
              <Button onClick={handleEnable} size="sm" className="text-xs">
                Activer
              </Button>
              <Button onClick={handleDismiss} variant="ghost" size="sm" className="text-xs text-muted-foreground">
                Plus tard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPrompt;
