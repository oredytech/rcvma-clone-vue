import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="bg-slate-900 text-slate-100 border-t border-slate-800 mt-12">
      <div className="container mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">À propos</h3>
            <p className="text-sm text-muted-foreground">
              Radio Communautaire de la Vie Meilleure en Action
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">Contact</h3>
            <div className="space-y-3">
              <a href="mailto:contact@rcvma.org" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                contact@rcvma.org
              </a>
              <a href="tel:+243123456789" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +243 123 456 789
              </a>
            </div>
          </div>

          {/* Address Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">Adresse</h3>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
              <p>
                Avenue de la Radio<br />
                Kinshasa, RDC
              </p>
            </div>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">Réseaux sociaux</h3>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground py-[8px]">
          <p>&copy; 2025 RCVMA - Tous droits réservés</p>
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