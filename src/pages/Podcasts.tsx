import { useState, useEffect, useRef } from "react";
import { Play, Pause, Clock, Calendar, SkipBack, SkipForward, Volume2, X, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaPlayer } from "@/hooks/useMediaPlayer";
import panaRadioLogo from "@/assets/pana-radio-logo.png";

interface PodcastEpisode {
  title: string;
  description: string;
  audioUrl: string;
  pubDate: string;
  duration: string;
  imageUrl?: string;
}

const Podcasts = () => {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([70]);
  const isMobile = useIsMobile();
  const { activePlayer, isPlaying, podcastInfo, switchToPodcast, togglePlay, setIsPlaying } = useMediaPlayer();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch podcast channel image for fallback
  const [channelImage, setChannelImage] = useState<string>("");

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch('https://podcast.zenomedia.com/api/public/podcasts/e422f99f-db57-40c3-a92e-778a15e5c2bb/rss');
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        
        // Get channel image as fallback
        const channelImg = xml.querySelector('channel > itunes\\:image')?.getAttribute('href') || 
                          xml.querySelector('channel > image > url')?.textContent || '';
        setChannelImage(channelImg);
        
        const items = xml.querySelectorAll('item');
        const parsedEpisodes: PodcastEpisode[] = Array.from(items).map(item => {
          const episodeImg = item.querySelector('itunes\\:image')?.getAttribute('href') || '';
          return {
            title: item.querySelector('title')?.textContent || '',
            description: item.querySelector('description')?.textContent || '',
            audioUrl: item.querySelector('enclosure')?.getAttribute('url') || '',
            pubDate: item.querySelector('pubDate')?.textContent || '',
            duration: item.querySelector('itunes\\:duration, duration')?.textContent || '00:00',
            imageUrl: episodeImg || channelImg
          };
        });
        setEpisodes(parsedEpisodes);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
      }
    };
    fetchPodcasts();
  }, []);

  const playEpisode = (episode: PodcastEpisode) => {
    if (isMobile) {
      setSelectedEpisode(episode);
      setIsSheetOpen(true);
      switchToPodcast({
        title: episode.title,
        audioUrl: episode.audioUrl,
        imageUrl: episode.imageUrl
      });
    } else {
      switchToPodcast({
        title: episode.title,
        audioUrl: episode.audioUrl,
        imageUrl: episode.imageUrl
      });
    }
  };

  const isCurrentEpisode = (episode: PodcastEpisode) => {
    return activePlayer === 'podcast' && podcastInfo?.audioUrl === episode.audioUrl;
  };

  // Mobile sheet audio controls
  useEffect(() => {
    if (isMobile && audioRef.current && selectedEpisode) {
      audioRef.current.src = selectedEpisode.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Erreur lecture:", err));
      }
    }
  }, [selectedEpisode, isPlaying, isMobile]);

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
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [setIsPlaying]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
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
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 15, duration);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0);
    }
  };

  const handleMobileTogglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pb-32">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <img src={panaRadioLogo} alt="PANA RADIO" className="h-10 w-10 object-contain" />
            <h1 className="text-4xl font-bold text-foreground">Podcasts</h1>
          </div>
          <p className="text-muted-foreground mb-8">Découvrez nos derniers épisodes</p>

          <ScrollArea className={`${isMobile ? 'h-[60vh]' : 'h-[calc(100vh-350px)]'}`}>
            <div className="grid gap-4">
              {episodes.map((episode, index) => (
                <div 
                  key={index} 
                  className={`bg-card border border-border rounded-lg p-4 hover:border-primary transition-all cursor-pointer ${isCurrentEpisode(episode) ? 'border-primary bg-primary/5' : ''}`} 
                  onClick={() => playEpisode(episode)}
                >
                  <div className="flex gap-4 items-start">
                    {/* Image à gauche - toujours affichée */}
                    <img 
                      src={episode.imageUrl || channelImage || panaRadioLogo} 
                      alt={episode.title} 
                      className="w-20 h-20 rounded-md object-cover flex-shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-2">{episode.title}</h3>
                      <p 
                        className="text-sm text-muted-foreground line-clamp-2 mb-2" 
                        dangerouslySetInnerHTML={{ __html: episode.description }} 
                      />
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(episode.pubDate).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {episode.duration}
                        </span>
                      </div>
                    </div>
                    <Button 
                      size="icon" 
                      variant={isCurrentEpisode(episode) && isPlaying ? "default" : "outline"} 
                      className="flex-shrink-0"
                      onClick={e => {
                        e.stopPropagation();
                        if (isCurrentEpisode(episode)) {
                          togglePlay();
                        } else {
                          playEpisode(episode);
                        }
                      }}
                    >
                      {isCurrentEpisode(episode) && isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>
      
      <Footer />

      {/* Mobile Podcast Player Sheet */}
      {isMobile && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="bottom" className="h-[85vh] rounded-tl-[12px] rounded-tr-[12px] border-t border-l border-r border-border flex flex-col">
            <audio ref={audioRef} preload="metadata" />
            
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-primary" />
                Lecture en cours
              </SheetTitle>
            </SheetHeader>

            {selectedEpisode && (
              <div className="flex-1 flex flex-col mt-4 overflow-hidden">
                {/* Episode image */}
                <div className="flex justify-center mb-6">
                  <img 
                    src={selectedEpisode.imageUrl || channelImage || panaRadioLogo} 
                    alt={selectedEpisode.title} 
                    className="w-48 h-48 rounded-lg object-cover shadow-lg" 
                  />
                </div>

                {/* Episode info */}
                <div className="text-center mb-6 px-4">
                  <h3 className="font-bold text-xl text-foreground line-clamp-2 mb-2">{selectedEpisode.title}</h3>
                  <p className="text-sm text-muted-foreground">PANA RADIO</p>
                </div>

                {/* Scrollable description */}
                <ScrollArea className="flex-1 mb-4 px-4">
                  <p 
                    className="text-sm text-muted-foreground" 
                    dangerouslySetInnerHTML={{ __html: selectedEpisode.description }} 
                  />
                </ScrollArea>

                {/* Player controls - fixed at bottom */}
                <div className="bg-card border-t border-border p-4 -mx-6 -mb-6">
                  {/* Progress bar */}
                  <div className="mb-4">
                    <Slider 
                      value={[currentTime]} 
                      max={duration || 100} 
                      step={1} 
                      onValueChange={handleSeek} 
                      className="cursor-pointer" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-6">
                    <Button size="icon" variant="ghost" onClick={skipBackward}>
                      <SkipBack className="h-6 w-6" />
                    </Button>
                    
                    <Button size="lg" onClick={handleMobileTogglePlay} className="h-14 w-14 rounded-full">
                      {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
                    </Button>
                    
                    <Button size="icon" variant="ghost" onClick={skipForward}>
                      <SkipForward className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default Podcasts;
