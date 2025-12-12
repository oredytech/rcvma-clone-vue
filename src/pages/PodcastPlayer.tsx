import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown, Clock, Calendar, Shuffle, Repeat, ListMusic, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  slug: string;
}

const PodcastPlayer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { setIsPlaying } = useMediaPlayer();
  
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setLocalIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [channelImage, setChannelImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Fetch all episodes
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://podcast.zenomedia.com/api/public/podcasts/e422f99f-db57-40c3-a92e-778a15e5c2bb/rss');
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        
        const channelImg = xml.querySelector('channel > itunes\\:image')?.getAttribute('href') || 
                          xml.querySelector('channel > image > url')?.textContent || '';
        setChannelImage(channelImg);
        
        const items = xml.querySelectorAll('item');
        const parsedEpisodes: PodcastEpisode[] = Array.from(items).map(item => {
          const title = item.querySelector('title')?.textContent || '';
          const episodeImg = item.querySelector('itunes\\:image')?.getAttribute('href') || '';
          return {
            title,
            description: item.querySelector('description')?.textContent || '',
            audioUrl: item.querySelector('enclosure')?.getAttribute('url') || '',
            pubDate: item.querySelector('pubDate')?.textContent || '',
            duration: item.querySelector('itunes\\:duration, duration')?.textContent || '00:00',
            imageUrl: episodeImg || channelImg,
            slug: generateSlug(title)
          };
        });
        
        setEpisodes(parsedEpisodes);
        
        // Find episode by slug or use first one
        if (slug) {
          const foundIndex = parsedEpisodes.findIndex(ep => ep.slug === slug);
          if (foundIndex !== -1) {
            setCurrentEpisode(parsedEpisodes[foundIndex]);
            setCurrentIndex(foundIndex);
          } else if (parsedEpisodes.length > 0) {
            setCurrentEpisode(parsedEpisodes[0]);
            setCurrentIndex(0);
          }
        } else if (parsedEpisodes.length > 0) {
          setCurrentEpisode(parsedEpisodes[0]);
          setCurrentIndex(0);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
        setIsLoading(false);
      }
    };
    fetchPodcasts();
  }, [slug]);

  // Audio setup
  useEffect(() => {
    if (audioRef.current && currentEpisode) {
      audioRef.current.src = currentEpisode.audioUrl;
      audioRef.current.load();
    }
  }, [currentEpisode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setLocalIsPlaying(false);
      setIsPlaying(false);
      // Auto-play next
      if (currentIndex < episodes.length - 1) {
        playNext();
      }
    };
    const handlePlay = () => {
      setLocalIsPlaying(true);
      setIsPlaying(true);
    };
    const handlePause = () => {
      setLocalIsPlaying(false);
      setIsPlaying(false);
    };

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
  }, [currentIndex, episodes.length, setIsPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Erreur lecture:", err));
      }
    }
  };

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

  const playNext = () => {
    if (currentIndex < episodes.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentEpisode(episodes[nextIndex]);
      navigate(`/podcast/${episodes[nextIndex].slug}`, { replace: true });
      setTimeout(() => {
        audioRef.current?.play().catch(err => console.error("Erreur lecture:", err));
      }, 100);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentEpisode(episodes[prevIndex]);
      navigate(`/podcast/${episodes[prevIndex].slug}`, { replace: true });
      setTimeout(() => {
        audioRef.current?.play().catch(err => console.error("Erreur lecture:", err));
      }, 100);
    }
  };

  const playEpisode = (episode: PodcastEpisode, index: number) => {
    setCurrentEpisode(episode);
    setCurrentIndex(index);
    navigate(`/podcast/${episode.slug}`, { replace: true });
    setTimeout(() => {
      audioRef.current?.play().catch(err => console.error("Erreur lecture:", err));
    }, 100);
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    navigate('/podcasts');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-48 h-48 bg-muted rounded-lg"></div>
          <div className="w-32 h-4 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!currentEpisode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Épisode non trouvé</p>
      </div>
    );
  }

  // Mobile Full Screen Player
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-primary/20 via-background to-background flex flex-col">
        <audio ref={audioRef} preload="metadata" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <ChevronDown className="h-6 w-6" />
          </Button>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lecture en cours</span>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-6 overflow-hidden">
          {/* Album Art */}
          <div className="flex justify-center py-6">
            <div className="relative">
              <img 
                src={currentEpisode.imageUrl || channelImage || panaRadioLogo} 
                alt={currentEpisode.title} 
                className="w-64 h-64 rounded-lg object-cover shadow-2xl bg-muted"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = panaRadioLogo;
                }}
              />
              {isPlaying && (
                <div className="absolute inset-0 rounded-lg bg-black/10 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          {/* Episode Info */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-foreground line-clamp-2 mb-1">{currentEpisode.title}</h2>
            <p className="text-sm text-muted-foreground">PANA RADIO</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Slider 
              value={[currentTime]} 
              max={duration || 100} 
              step={1} 
              onValueChange={handleSeek} 
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={playPrevious}
              disabled={currentIndex === 0}
              className="h-12 w-12"
            >
              <SkipBack className="h-6 w-6" />
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={skipBackward}
              className="h-10 w-10"
            >
              <span className="text-xs font-bold">-15</span>
            </Button>
            
            <Button 
              size="lg" 
              onClick={togglePlay} 
              className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90"
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={skipForward}
              className="h-10 w-10"
            >
              <span className="text-xs font-bold">+15</span>
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={playNext}
              disabled={currentIndex === episodes.length - 1}
              className="h-12 w-12"
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>

          {/* Episode List */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <ListMusic className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Épisodes suivants</span>
            </div>
            
            <ScrollArea className="h-full pb-4">
              <div className="space-y-2">
                {episodes.map((episode, index) => (
                  <div 
                    key={index}
                    onClick={() => playEpisode(episode, index)}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      index === currentIndex 
                        ? 'bg-primary/20 border border-primary/30' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <img 
                      src={episode.imageUrl || channelImage || panaRadioLogo}
                      alt={episode.title}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium line-clamp-1 ${index === currentIndex ? 'text-primary' : 'text-foreground'}`}>
                        {episode.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{episode.duration}</p>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        playEpisode(episode, index);
                      }}
                    >
                      {index === currentIndex && isPlaying ? (
                        <Pause className="h-4 w-4 text-primary" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Spotify-like Player
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background">
      <audio ref={audioRef} preload="metadata" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="ghost" onClick={handleClose} className="mb-6">
          <ChevronDown className="h-4 w-4 mr-2 rotate-90" />
          Retour aux podcasts
        </Button>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Main Player */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Album Art */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  <img 
                    src={currentEpisode.imageUrl || channelImage || panaRadioLogo} 
                    alt={currentEpisode.title} 
                    className="w-64 h-64 md:w-80 md:h-80 rounded-xl object-cover shadow-2xl transition-transform group-hover:scale-[1.02] bg-muted"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = panaRadioLogo;
                    }}
                  />
                  {isPlaying && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-1">
                      <span className="w-1 h-4 bg-primary rounded-full animate-pulse"></span>
                      <span className="w-1 h-6 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></span>
                      <span className="w-1 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info & Controls */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">Podcast</span>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-3 line-clamp-3">
                    {currentEpisode.title}
                  </h1>
                  <p className="text-muted-foreground mb-4">PANA RADIO</p>
                  
                  <div className="flex gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(currentEpisode.pubDate).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {currentEpisode.duration}
                    </span>
                  </div>

                  <ScrollArea className="h-32 mb-6">
                    <p 
                      className="text-sm text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: currentEpisode.description }}
                    />
                  </ScrollArea>
                </div>

                {/* Progress & Controls */}
                <div>
                  <div className="mb-4">
                    <Slider 
                      value={[currentTime]} 
                      max={duration || 100} 
                      step={1} 
                      onValueChange={handleSeek} 
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <Shuffle className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={playPrevious}
                        disabled={currentIndex === 0}
                        className="h-10 w-10"
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>
                      
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={skipBackward}
                        className="h-8 w-8"
                      >
                        <span className="text-xs font-bold">-15</span>
                      </Button>
                      
                      <Button 
                        size="lg" 
                        onClick={togglePlay} 
                        className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90"
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                      </Button>
                      
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={skipForward}
                        className="h-8 w-8"
                      >
                        <span className="text-xs font-bold">+15</span>
                      </Button>
                      
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={playNext}
                        disabled={currentIndex === episodes.length - 1}
                        className="h-10 w-10"
                      >
                        <SkipForward className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <Slider 
                        value={[isMuted ? 0 : volume]} 
                        max={100} 
                        step={1} 
                        onValueChange={(v) => {
                          setVolume(v[0]);
                          setIsMuted(false);
                        }}
                        className="w-24 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Episode Queue */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <ListMusic className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Tous les épisodes</h2>
            </div>
            
            <ScrollArea className="h-[600px]">
              <div className="space-y-2 pr-2">
                {episodes.map((episode, index) => (
                  <div 
                    key={index}
                    onClick={() => playEpisode(episode, index)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      index === currentIndex 
                        ? 'bg-primary/20 border border-primary/30' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <span className="text-xs text-muted-foreground w-5 text-center flex-shrink-0">
                      {index === currentIndex && isPlaying ? (
                        <div className="flex items-center justify-center gap-[2px]">
                          <span className="w-[2px] h-2 bg-primary rounded-full animate-pulse"></span>
                          <span className="w-[2px] h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></span>
                          <span className="w-[2px] h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                        </div>
                      ) : (
                        index + 1
                      )}
                    </span>
                    
                    <img 
                      src={episode.imageUrl || channelImage || panaRadioLogo}
                      alt={episode.title}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium line-clamp-2 ${index === currentIndex ? 'text-primary' : 'text-foreground'}`}>
                        {episode.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{episode.duration}</p>
                    </div>
                    
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 flex-shrink-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        playEpisode(episode, index);
                      }}
                    >
                      {index === currentIndex && isPlaying ? (
                        <Pause className="h-4 w-4 text-primary" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer;
