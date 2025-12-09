import { Link } from "react-router-dom";
import { Play, Search, Info, Mail, Menu, Home, Users, Calendar, Facebook, Twitter, Youtube, Settings, Shield, FileText, Phone, Tv, Podcast } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { WordPressCategory } from "@/lib/wordpress";
import CategoryBar from "@/components/CategoryBar";
import DateTimeDisplay from "@/components/DateTimeDisplay";
import BreakingNews from "@/components/BreakingNews";
import { useState } from "react";
import { useMediaPlayer } from "@/hooks/useMediaPlayer";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import CookieSettings from "@/components/CookieSettings";
import panaRadioLogo from "@/assets/pana-radio-logo.png";
interface HeaderProps {
  categories?: WordPressCategory[];
  selectedCategory?: number | null;
  onCategorySelect?: (categoryId: number | null) => void;
}
const Header = ({
  categories = [],
  selectedCategory = null,
  onCategorySelect
}: HeaderProps) => {
  const isMobile = useIsMobile();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState<string | null>(null);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const {
    switchToRadio
  } = useMediaPlayer();
  const scrollDirection = useScrollDirection();
  const handleLiveClick = () => {
    switchToRadio();
  };
  return <>
      {/* Barre d'heure/date mobile en haut */}
      {isMobile && <div className={`
            fixed top-0 left-0 right-0 bg-primary text-primary-foreground z-50 h-[40px] 
            flex items-center justify-between px-4 border-b border-white/10
            transition-transform duration-300
            ${scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'}
          `}>
          <DateTimeDisplay split type="time" />
          <DateTimeDisplay split type="date" />
        </div>}

      <header className={`bg-primary text-primary-foreground sticky z-50 shadow-lg ${isMobile && scrollDirection !== 'down' ? 'top-[40px]' : 'top-0'}`}>
        {/* Menu supérieur - masqué sur mobile */}
        {!isMobile && <div className="border-b border-white/10">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between py-1">
                <DateTimeDisplay />
                <div className="ml-auto">
                  <NavigationMenu>
                    <NavigationMenuList className="gap-1">
                    <NavigationMenuItem>
                      <NavigationMenuLink href="/a-propos" className="text-xs px-3 py-1 hover:bg-white/10 rounded transition-colors">
                        À propos
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink href="/contacts" className="text-xs px-3 py-1 hover:bg-white/10 rounded transition-colors">
                        Contacts
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink className="text-xs px-3 py-1 hover:bg-white/10 rounded transition-colors" href="/thematiques">
                        ​Thématiques 
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink href="/podcasts" className="text-xs px-3 py-1 hover:bg-white/10 rounded transition-colors">
                        Podcasts
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink href="/rechercher" className="text-xs px-3 py-1 hover:bg-white/10 rounded transition-colors flex items-center gap-1">
                        <Search className="h-3 w-3" />
                        Rechercher
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                </div>
              </div>
            </div>
          </div>}

      {/* En-tête principal */}
      <div className="container mx-auto bg-[#ff0000] px-px">
        <div className="flex items-center justify-between h-[30px] px-[16px]">
          <Link to="/" className="flex items-center gap-2">
            <img src={panaRadioLogo} alt="PANA RADIO" className="h-6 w-6 object-contain" />
            <div>
              <h1 className="text-sm font-bold tracking-tight">PANA RADIO</h1>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link to="/tv-direct">
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/40 h-6 text-xs px-2">
                <Tv className="h-3 w-3 mr-1" />
                TV
              </Button>
            </Link>
            <Button size="sm" variant="secondary" onClick={handleLiveClick} className="bg-white/20 hover:bg-white/30 text-white border-white/40 h-6 text-xs px-2">
              <Play className="h-3 w-3 mr-1 fill-current" />
              EN DIRECT
            </Button>
          </div>
        </div>
      </div>
      </header>

      {/* Barre de catégories - masquée sur mobile */}
      {!isMobile && categories.length > 0 && onCategorySelect && <CategoryBar categories={categories} selectedCategory={selectedCategory} onCategorySelect={onCategorySelect} />}

      {/* Bande Breaking News */}
      <BreakingNews />

      {/* Menu mobile en bas */}
      {isMobile && <>
          <nav className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground z-50 pb-safe rounded-tl-[8px] rounded-tr-[8px]">
            <div className="flex items-center justify-around h-[63px]">
              <Link to="/" className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white/10 rounded transition-colors">
                <Home className="h-5 w-5" />
                <span className="text-[10px]">Accueil</span>
              </Link>

              <Link to="/podcasts" className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white/10 rounded transition-colors">
                <Podcast className="h-5 w-5" />
                <span className="text-[10px]">Podcasts</span>
              </Link>
              
              <Sheet open={isCategoriesOpen === "about"} onOpenChange={open => setIsCategoriesOpen(open ? "about" : null)}>
                <SheetTrigger asChild>
                  <button className={`flex flex-col items-center gap-1 px-3 py-2 rounded transition-colors ${isCategoriesOpen === "about" ? "bg-white/20" : "hover:bg-white/10"}`}>
                    <Info className="h-5 w-5" />
                    <span className="text-xs">Nous</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] overflow-y-auto rounded-tl-[12px] rounded-tr-[12px] border-t border-l border-r border-border">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <img src={panaRadioLogo} alt="PANA RADIO" className="h-8 w-8 object-contain" />
                      À propos de PANA RADIO
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-8">
                    <div className="text-center">
                      <p className="text-accent font-extrabold text-3xl text-center">
                        Radio Panafricaine 
                      </p>
                    </div>

                    <section>
                      <h3 className="text-xl font-bold mb-3 text-foreground flex items-center gap-2">
                        
                        Notre Mission
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        PANA RADIO est une radio panafricaine fondée en 2020 par des jeunes Africains, notamment les TCR (Techniciens Chargés de Reportages) d'Afrique francophone, certifiés par RFI sous la bourse Claude VERLON et Ghislaine DUPONT en 2020-2021. Nous promouvons la paix, l'unité des peuples africains, ainsi que la sensibilisation à l'environnement et à la santé.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-bold mb-3 text-foreground flex items-center gap-2">
                        
                        Nos Langues
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Nous diffusons des émissions en swahili, wolof, lingala, français et anglais, 
                        pour toucher un large public à travers le continent africain.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-bold mb-3 text-foreground flex items-center gap-2">
                        
                        Notre Programmation
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Notre programmation inclut des contenus sur la science, la technologie, la culture, 
                        la musique, et des messages d'amour et de solidarité en faveur d'un développement 
                        durable et d'une Afrique unie.
                      </p>
                    </section>
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet open={isCategoriesOpen === "contact"} onOpenChange={open => setIsCategoriesOpen(open ? "contact" : null)}>
                <SheetTrigger asChild>
                  <button className={`flex flex-col items-center gap-1 px-3 py-2 rounded transition-colors ${isCategoriesOpen === "contact" ? "bg-white/20" : "hover:bg-white/10"}`}>
                    <Mail className="h-5 w-5" />
                    <span className="text-[10px]">Contacts</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] overflow-y-auto rounded-tl-[12px] rounded-tr-[12px] border-t border-l border-r border-border">
                  <SheetHeader>
                    <SheetTitle>Contacts</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                       <a href="mailto:contact@panaradio.net" className="text-foreground hover:text-primary">
                        contact@panaradio.net
                       </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <a href="tel:+243996886079" className="text-foreground hover:text-primary">
                        +243 996 886 079
                      </a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Sheet open={isCategoriesOpen === "categories"} onOpenChange={open => setIsCategoriesOpen(open ? "categories" : null)}>
                <SheetTrigger asChild>
                  <button className={`flex flex-col items-center gap-1 px-3 py-2 rounded transition-colors ${isCategoriesOpen === "categories" ? "bg-white/20" : "hover:bg-white/10"}`}>
                    <Menu className="h-5 w-5" />
                    <span className="text-[10px]">Menu</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] overflow-y-auto rounded-tl-[12px] rounded-tr-[12px] border-t border-l border-r border-border">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">
                    {/* Catégories */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-foreground">​Thématiques </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map(category => <Link key={category.id} to={`/categories?category=${category.id}`} onClick={() => {
                      setIsCategoriesOpen(null);
                      onCategorySelect?.(category.id);
                    }} className="bg-card border border-border rounded-lg p-3 hover:border-primary transition-all text-sm">
                            {category.name}
                          </Link>)}
                      </div>
                    </div>

                    {/* Menu supplémentaire */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-foreground">Navigation</h3>
                      <div className="space-y-2">
                        <Link to="/equipe" onClick={() => setIsCategoriesOpen(null)} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary transition-all">
                          <Users className="h-5 w-5 text-primary" />
                          <span>L'équipe</span>
                        </Link>
                        <Link to="/programme" onClick={() => setIsCategoriesOpen(null)} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary transition-all">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span>Le programme</span>
                        </Link>
                      </div>
                    </div>

                    {/* Réseaux sociaux */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-foreground">Suivez-nous</h3>
                      <div className="flex gap-4">
                        <a href="https://web.facebook.com/panaradio/" target="_blank" rel="noopener noreferrer" className="bg-card border border-border p-3 rounded-lg hover:border-primary transition-all">
                          <Facebook className="h-6 w-6 text-primary" />
                        </a>
                        <a href="https://x.com/Panaradio10" target="_blank" rel="noopener noreferrer" className="bg-card border border-border p-3 rounded-lg hover:border-primary transition-all">
                          <Twitter className="h-6 w-6 text-primary" />
                        </a>
                        <a href="https://www.youtube.com/@PanaRadio-qr4dv" target="_blank" rel="noopener noreferrer" className="bg-card border border-border p-3 rounded-lg hover:border-primary transition-all">
                          <Youtube className="h-6 w-6 text-primary" />
                        </a>
                      </div>
                    </div>

                    {/* Paramètres et légal */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-foreground">Paramètres & Légal</h3>
                      <div className="space-y-2">
                        <button onClick={() => {
                      setShowCookieSettings(true);
                      setIsCategoriesOpen(null);
                    }} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary transition-all w-full text-left">
                          <Settings className="h-5 w-5 text-primary" />
                          <span>Paramètres des cookies</span>
                        </button>
                        <Link to="/confidentialite" onClick={() => setIsCategoriesOpen(null)} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary transition-all">
                          <Shield className="h-5 w-5 text-primary" />
                          <span>Politique de confidentialité</span>
                        </Link>
                        <Link to="/conditions" onClick={() => setIsCategoriesOpen(null)} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary transition-all">
                          <FileText className="h-5 w-5 text-primary" />
                          <span>Conditions d'utilisation</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Link to="/rechercher" className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white/10 rounded transition-colors">
                <Search className="h-5 w-5" />
                <span className="text-[10px]">Rechercher</span>
              </Link>
            </div>
          </nav>
        </>}

      {/* Dialog des paramètres de cookies */}
      <CookieSettings open={showCookieSettings} onOpenChange={setShowCookieSettings} />
    </>;
};
export default Header;