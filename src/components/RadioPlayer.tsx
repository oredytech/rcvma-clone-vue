import { Play, Pause, Volume2, Radio, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRadioPlayer } from "@/hooks/useRadioPlayer";
import { useScrollDirection } from "@/hooks/useScrollDirection";

const RadioPlayer = () => {
  const [volume, setVolume] = useState([70]);
  const isMobile = useIsMobile();
  const { isVisible, isPlaying, setIsVisible, setIsPlaying, togglePlay } = useRadioPlayer();
  const scrollDirection = useScrollDirection();
  const [isMinimized, setIsMinimized] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isMobile && scrollDirection === 'down' && window.scrollY > 50) {
      setIsMinimized(true);
    } else if (scrollDirection === 'up' || window.scrollY <= 50) {
      setIsMinimized(false);
    }
  }, [scrollDirection, isMobile]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Erreur lecture audio:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  // Sur desktop, toujours visible
  if (!isMobile && !isVisible) {
    setIsVisible(true);
  }

  if (!isVisible) return null;

  if (isMobile && isMinimized) {
    return (
      <div 
        className="fixed bottom-[63px] right-4 z-40 animate-in slide-in-from-bottom-2"
      >
        <Button
          size="sm"
          onClick={togglePlay}
          className="bg-primary hover:bg-primary/90 h-12 w-12 p-0 rounded-full shadow-lg"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <>
      <audio ref={audioRef} src="https://stream.zeno.fm/qdgq60qkb3gvv" preload="none" />
      
      <div 
        className={`
          fixed left-0 right-0 bg-slate-900 text-white shadow-2xl border-t border-slate-800 z-40
          ${isMobile ? 'bottom-[63px] rounded-tl-[8px] rounded-tr-[8px]' : 'bottom-0'}
        `}
      >
        <div className="container mx-auto px-4 py-2">
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
              onClick={togglePlay}
              className="bg-primary hover:bg-primary/90 h-9 w-9 p-0"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </Button>

            {/* Bouton fermer - masqué sur desktop */}
            {isMobile && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsVisible(false)}
                className="h-9 w-9 p-0 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RadioPlayer;
