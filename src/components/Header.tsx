import { Link } from "react-router-dom";
import { Play, Radio, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
      {/* Menu supérieur */}
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
  );
};

export default Header;
