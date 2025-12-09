import { Mail, Phone, MapPin, Facebook, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import panaRadioLogo from "@/assets/pana-radio-logo.png";

const Footer = () => {
  return <footer className="bg-slate-900 text-slate-100 border-t border-slate-800 mt-12">
      <div className="container mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={panaRadioLogo} alt="PANA RADIO" className="h-10 w-10 object-contain" />
              <h3 className="text-lg font-bold text-secondary">PANA RADIO</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              PANA RADIO est une radio panafricaine basée à Goma, en RDC, promouvant la paix, 
              l'unité africaine et la sensibilisation à l'environnement et à la santé.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">Contact</h3>
            <div className="space-y-3">
              <a href="mailto:contact@panaradio.net" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                contact@panaradio.net
              </a>
              <a href="tel:+243996886079" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +243 996 886 079
              </a>
            </div>
          </div>

          {/* Address Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">Adresse</h3>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
              <p>
                Ville de Goma<br />
                Nord-Kivu, RDC
              </p>
            </div>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">Réseaux sociaux</h3>
            <div className="flex gap-4">
              <a href="https://web.facebook.com/panaradio/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://x.com/Panaradio10" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/@PanaRadio-qr4dv" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground py-[8px]">
          <p>&copy; 2025 PANA RADIO - Tous droits réservés</p>
          <p className="mt-2">
            Fièrement conçu par{" "}
            <a href="https://oredytech.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
              Oredy TECHNOLOGIES
            </a>
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;
