import { Play, Pause, Volume2, Radio, X, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaPlayer } from "@/hooks/useMediaPlayer";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import panaRadioLogo from "@/assets/pana-radio-logo.png";

const RADIO_STREAM_URL = "https://stream.zeno.fm/qdgq60qkb3gvv";

const MediaPlayer = () => {
  const [volume, setVolume] = useState([70]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const isMobile = useIsMobile();
  const {
    activePlayer,
    isVisible,
    isPlaying,
    podcastInfo,
    setIsVisible,
    setIsPlaying,
    togglePlay,
    closePlayer
  } = useMediaPlayer();
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
      if (activePlayer === 'radio') {
        audioRef.current.src = RADIO_STREAM_URL;
      } else if (activePlayer === 'podcast' && podcastInfo) {
        audioRef.current.src = podcastInfo.audioUrl;
      }
      
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Erreur lecture audio:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, activePlayer, podcastInfo]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [setIsPlaying]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current && activePlayer === 'podcast') {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const skipForward = () => {
    if (audioRef.current && activePlayer === 'podcast') {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 15, duration);
    }
  };

  const skipBackward = () => {
    if (audioRef.current && activePlayer === 'podcast') {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0);
    }
  };

  // Sur desktop, toujours visible si activePlayer
  if (!isMobile && activePlayer && !isVisible) {
    setIsVisible(true);
  }

  if (isMobile && isMinimized && isVisible && activePlayer) {
    return (
      <>
        <audio ref={audioRef} preload="none" />
        <div className="fixed bottom-[63px] right-4 z-40 animate-in slide-in-from-bottom-2">
          <Button 
            size="sm" 
            onClick={togglePlay} 
            className="bg-primary hover:bg-primary/90 h-11 w-11 p-0 rounded-full shadow-lg opacity-70"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </Button>
        </div>
      </>
    );
  }

  if (!isVisible || !activePlayer) return null;

  return (
    <>
      <audio ref={audioRef} preload="none" />
      
      <div className={`
          fixed left-0 right-0 bg-slate-900 text-white shadow-2xl border-t border-slate-800 z-40
          ${isMobile ? 'bottom-[63px] rounded-tl-[8px] rounded-tr-[8px]' : 'bottom-0'}
        `}>
        <div className="container mx-auto px-4 py-2">
          {/* Barre de progression pour podcast */}
          {activePlayer === 'podcast' && (
            <div className="mb-2">
              <Slider 
                value={[currentTime]} 
                max={duration || 100} 
                step={1} 
                onValueChange={handleSeek} 
                className="cursor-pointer" 
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            {/* Info media */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 bg-primary/20 p-2 rounded-lg">
                {activePlayer === 'radio' ? (
                  <img src={panaRadioLogo} alt="PANA RADIO" className="h-8 w-8 object-contain" />
                ) : podcastInfo?.imageUrl ? (
                  <img src={podcastInfo.imageUrl} alt="Podcast" className="h-8 w-8 object-cover rounded" />
                ) : (
                  <Radio className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">
                  {activePlayer === 'radio' ? 'PANA RADIO' : podcastInfo?.title || 'Podcast'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {activePlayer === 'radio' ? 'En direct' : 'Podcast'}
                </p>
              </div>
            </div>

            {/* Contrôles */}
            <div className="flex items-center gap-3">
              {/* Skip buttons pour podcast */}
              {activePlayer === 'podcast' && (
                <Button size="sm" variant="ghost" onClick={skipBackward} className="h-8 w-8 p-0 hover:bg-white/10">
                  <SkipBack className="h-4 w-4" />
                </Button>
              )}

              {/* Volume - masqué sur mobile */}
              {!isMobile && (
                <div className="flex items-center gap-2 w-24">
                  <Volume2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="flex-1" />
                </div>
              )}

              {/* Bouton play/pause */}
              <Button size="sm" onClick={togglePlay} className="bg-primary hover:bg-primary/90 h-9 w-9 p-0">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </Button>

              {/* Skip forward pour podcast */}
              {activePlayer === 'podcast' && (
                <Button size="sm" variant="ghost" onClick={skipForward} className="h-8 w-8 p-0 hover:bg-white/10">
                  <SkipForward className="h-4 w-4" />
                </Button>
              )}

              {/* Bouton fermer - masqué sur desktop pour radio */}
              {(isMobile || activePlayer === 'podcast') && (
                <Button size="sm" variant="ghost" onClick={closePlayer} className="h-9 w-9 p-0 hover:bg-white/10">
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

export default MediaPlayer;
