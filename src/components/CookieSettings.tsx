import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCookieConsent, CookiePreferences } from "@/hooks/useCookieConsent";
import { useToast } from "@/hooks/use-toast";

interface CookieSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CookieSettings = ({ open, onOpenChange }: CookieSettingsProps) => {
  const { preferences, setConsent, acceptAll } = useCookieConsent();
  const { toast } = useToast();
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);

  const handleSave = () => {
    setConsent(localPreferences);
    toast({
      title: "Préférences enregistrées",
      description: "Vos préférences de cookies ont été mises à jour.",
    });
    onOpenChange(false);
  };

  const handleAcceptAll = () => {
    acceptAll();
    toast({
      title: "Tous les cookies acceptés",
      description: "Vous avez accepté tous les types de cookies.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Paramètres des cookies</DialogTitle>
          <DialogDescription>
            Gérez vos préférences en matière de cookies. Les cookies nécessaires sont toujours activés pour assurer le bon fonctionnement du site.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Cookies nécessaires */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1">
                <Label className="text-base font-semibold">Cookies nécessaires</Label>
                <p className="text-sm text-muted-foreground">
                  Ces cookies sont essentiels au fonctionnement du site. Ils ne peuvent pas être désactivés.
                </p>
              </div>
              <Switch checked={true} disabled className="ml-4" />
            </div>
            <div className="text-xs text-muted-foreground pl-4 border-l-2 border-muted">
              Exemples : authentification, sécurité, préférences de navigation
            </div>
          </div>

          {/* Cookies analytiques */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1">
                <Label htmlFor="analytics" className="text-base font-semibold">
                  Cookies analytiques
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ces cookies nous aident à comprendre comment vous utilisez notre site pour l'améliorer.
                </p>
              </div>
              <Switch
                id="analytics"
                checked={localPreferences.analytics}
                onCheckedChange={(checked) =>
                  setLocalPreferences({ ...localPreferences, analytics: checked })
                }
                className="ml-4"
              />
            </div>
            <div className="text-xs text-muted-foreground pl-4 border-l-2 border-muted">
              Exemples : statistiques de visite, pages consultées, temps passé sur le site
            </div>
          </div>

          {/* Cookies marketing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1">
                <Label htmlFor="marketing" className="text-base font-semibold">
                  Cookies marketing
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ces cookies sont utilisés pour vous proposer des publicités pertinentes.
                </p>
              </div>
              <Switch
                id="marketing"
                checked={localPreferences.marketing}
                onCheckedChange={(checked) =>
                  setLocalPreferences({ ...localPreferences, marketing: checked })
                }
                className="ml-4"
              />
            </div>
            <div className="text-xs text-muted-foreground pl-4 border-l-2 border-muted">
              Exemples : publicités ciblées, réseaux sociaux, suivi des conversions
            </div>
          </div>

          {/* Cookies de préférences */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1">
                <Label htmlFor="preferences" className="text-base font-semibold">
                  Cookies de préférences
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ces cookies mémorisent vos choix pour personnaliser votre expérience.
                </p>
              </div>
              <Switch
                id="preferences"
                checked={localPreferences.preferences}
                onCheckedChange={(checked) =>
                  setLocalPreferences({ ...localPreferences, preferences: checked })
                }
                className="ml-4"
              />
            </div>
            <div className="text-xs text-muted-foreground pl-4 border-l-2 border-muted">
              Exemples : langue, mode sombre/clair, préférences d'affichage
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Annuler
          </Button>
          <Button variant="secondary" onClick={handleAcceptAll} className="w-full sm:w-auto">
            Tout accepter
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            Enregistrer mes choix
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CookieSettings;
