import { Link } from "react-router-dom";
import { Play, Radio, Search, Info, Mail, Menu, Home, Users, Calendar, Facebook, Instagram, Twitter, Youtube, Settings, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { WordPressCategory } from "@/lib/wordpress";
import CategoryBar from "@/components/CategoryBar";
import DateTimeDisplay from "@/components/DateTimeDisplay";
import { useState } from "react";

interface HeaderProps {
  categories?: WordPressCategory[];
  selectedCategory?: number | null;
  onCategorySelect?: (categoryId: number | null) => void;
}

const Header = ({ categories = [], selectedCategory = null, onCategorySelect }: HeaderProps) => {
  const isMobile = useIsMobile();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  return (
    <>
      {/* Barre d'heure/date mobile en haut */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-primary text-primary-foreground z-50 h-[40px] flex items-center px-4 border-b border-white/10">
          <DateTimeDisplay />
        </div>
      )}

      <header className={`bg-primary text-primary-foreground sticky z-50 shadow-lg ${isMobile ? 'top-[40px]' : 'top-0'}`}>
        {/* Menu supérieur - masqué sur mobile */}
        {!isMobile && (
          <div className="border-b border-white/10">
            <div className="container mx-auto px-4">
              <NavigationMenu className="max-w-full justify-end py-1">
                <NavigationMenuList className="gap-1">
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/a-propos"
                      className="text-xs px-3 py-1 hover:bg-white/10 rounded transition-colors"
                    >
                      À propos
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/contacts"
                      className="text-xs px-3 py-1 hover:bg-white/10 rounded transition-colors"
                    >
                      Contacts
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/categories"
                      className="text-xs px-3 py-1 hover:bg-white/10 rounded transition-colors"
                    >
                      Catégories
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/rechercher"
                      className="text-xs px-3 py-1 hover:bg-white/10 rounded transition-colors flex items-center gap-1"
                    >
                      <Search className="h-3 w-3" />
                      Rechercher
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        )}

      {/* En-tête principal */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[30px]">
          {!isMobile && <DateTimeDisplay />}
          
          <Link to="/" className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            <div>
              <h1 className="text-sm font-bold tracking-tight">RCVMA</h1>
            </div>
          </Link>
          
          <Button 
            size="sm" 
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-white/40 h-6 text-xs px-2"
          >
            <Play className="h-3 w-3 mr-1 fill-current" />
            EN DIRECT
          </Button>
        </div>
      </div>
      </header>

      {/* Barre de catégories */}
      {categories.length > 0 && onCategorySelect && (
        <CategoryBar 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onCategorySelect={onCategorySelect} 
        />
      )}

      {/* Menu mobile en bas */}
      {isMobile && (
        <>
          <nav className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground border-t border-white/10 z-50 pb-safe">
            <div className="flex items-center justify-around h-[70px]">
              <Link to="/" className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white/10 rounded transition-colors">
                <Home className="h-5 w-5" />
                <span className="text-[10px]">Accueil</span>
              </Link>
              <Link to="/a-propos" className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white/10 rounded transition-colors">
                <Info className="h-5 w-5" />
                <span className="text-[10px]">À propos</span>
              </Link>
              <Link to="/contacts" className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white/10 rounded transition-colors">
                <Mail className="h-5 w-5" />
                <span className="text-[10px]">Contacts</span>
              </Link>
              
              <Sheet open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
                <SheetTrigger asChild>
                  <button className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white/10 rounded transition-colors">
                    <Menu className="h-5 w-5" />
                    <span className="text-[10px]">Catégories</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">
                    {/* Catégories */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-foreground">Catégories</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            to={`/categories?category=${category.id}`}
                            onClick={() => {
                              setIsCategoriesOpen(false);
                              onCategorySelect?.(category.id);
                            }}
                            className="bg-card border border-border rounded-lg p-3 hover:border-primary transition-all text-sm"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Menu supplémentaire */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-foreground">Navigation</h3>
                      <div className="space-y-2">
                        <Link 
                          to="/equipe" 
                          onClick={() => setIsCategoriesOpen(false)}
                          className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary transition-all"
                        >
                          <Users className="h-5 w-5 text-primary" />
                          <span>L'équipe</span>
                        </Link>
                        <Link 
                          to="/programme" 
                          onClick={() => setIsCategoriesOpen(false)}
                          className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary transition-all"
                        >
                          <Calendar className="h-5 w-5 text-primary" />
                          <span>Le programme</span>
                        </Link>
                      </div>
                    </div>

                    {/* Réseaux sociaux */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-foreground">Suivez-nous</h3>
                      <div className="flex gap-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-card border border-border p-3 rounded-lg hover:border-primary transition-all">
                          <Facebook className="h-6 w-6 text-primary" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-card border border-border p-3 rounded-lg hover:border-primary transition-all">
                          <Instagram className="h-6 w-6 text-primary" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-card border border-border p-3 rounded-lg hover:border-primary transition-all">
                          <Twitter className="h-6 w-6 text-primary" />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-card border border-border p-3 rounded-lg hover:border-primary transition-all">
                          <Youtube className="h-6 w-6 text-primary" />
                        </a>
                      </div>
                    </div>

                    {/* Paramètres et légal */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-foreground">Paramètres & Légal</h3>
                      <div className="space-y-2">
                        <button className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary transition-all w-full text-left">
                          <Settings className="h-5 w-5 text-primary" />
                          <span>Paramètres des cookies</span>
                        </button>
                        <Link 
                          to="/confidentialite" 
                          onClick={() => setIsCategoriesOpen(false)}
                          className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary transition-all"
                        >
                          <Shield className="h-5 w-5 text-primary" />
                          <span>Politique de confidentialité</span>
                        </Link>
                        <Link 
                          to="/conditions" 
                          onClick={() => setIsCategoriesOpen(false)}
                          className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary transition-all"
                        >
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
        </>
      )}
    </>
  );
};

export default Header;
