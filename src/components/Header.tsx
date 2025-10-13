import { Link } from "react-router-dom";
import { Play, Radio, Search, Info, Mail, Menu, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { WordPressCategory } from "@/lib/wordpress";
import CategoryBar from "@/components/CategoryBar";

interface HeaderProps {
  categories?: WordPressCategory[];
  selectedCategory?: number | null;
  onCategorySelect?: (categoryId: number | null) => void;
}

const Header = ({ categories = [], selectedCategory = null, onCategorySelect }: HeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
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
            <Link to="/categories" className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white/10 rounded transition-colors">
              <Menu className="h-5 w-5" />
              <span className="text-[10px]">Catégories</span>
            </Link>
            <Link to="/rechercher" className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white/10 rounded transition-colors">
              <Search className="h-5 w-5" />
              <span className="text-[10px]">Rechercher</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;
