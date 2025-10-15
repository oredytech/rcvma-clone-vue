import { Play, Pause, Volume2, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const isMobile = useIsMobile();

  return (
    <div 
      className={`
        fixed left-0 right-0 bg-slate-900 text-white shadow-2xl border-t border-slate-800 z-40
        ${isMobile ? 'bottom-[70px]' : 'bottom-0'}
      `}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Info radio */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 bg-primary/20 p-2 rounded-lg">
              <Radio className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">RCVMA Radio</p>
              <p className="text-xs text-slate-400 truncate">En direct</p>
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center gap-3">
            {/* Volume - masqué sur mobile */}
            {!isMobile && (
              <div className="flex items-center gap-2 w-24">
                <Volume2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
            )}

            {/* Bouton play/pause */}
            <Button
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-primary hover:bg-primary/90 h-9 w-9 p-0"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
