import { Link } from "react-router-dom";
import { Play, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <Radio className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">RCVMA</h1>
              <p className="text-xs opacity-90">Radio Communautaire de la Vie Meilleure en Action</p>
            </div>
          </Link>
          
          <Button 
            size="sm" 
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-white/40"
          >
            <Play className="h-4 w-4 mr-2 fill-current" />
            EN DIRECT
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
