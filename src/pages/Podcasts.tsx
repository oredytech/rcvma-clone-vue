import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isMobile = useIsMobile();
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch('https://podcast.zenomedia.com/api/public/podcasts/e422f99f-db57-40c3-a92e-778a15e5c2bb/rss');
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const items = xml.querySelectorAll('item');
        const parsedEpisodes: PodcastEpisode[] = Array.from(items).map(item => ({
          title: item.querySelector('title')?.textContent || '',
          description: item.querySelector('description')?.textContent || '',
          audioUrl: item.querySelector('enclosure')?.getAttribute('url') || '',
          pubDate: item.querySelector('pubDate')?.textContent || '',
          duration: item.querySelector('itunes\\:duration, duration')?.textContent || '00:00',
          imageUrl: item.querySelector('itunes\\:image')?.getAttribute('href') || xml.querySelector('channel > itunes\\:image')?.getAttribute('href') || ''
        }));
        setEpisodes(parsedEpisodes);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
      }
    };
    fetchPodcasts();
  }, []);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  const playEpisode = (episode: PodcastEpisode) => {
    setCurrentEpisode(episode);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = episode.audioUrl;
      audioRef.current.play();
    }
  };
  const togglePlay = () => {
    if (!audioRef.current || !currentEpisode) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
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
  return <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pb-32">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Podcasts OREDY MEDIA</h1>
          <p className="text-muted-foreground mb-8">Découvrez nos derniers épisodes</p>

          <ScrollArea className={`${isMobile ? 'h-[60vh]' : 'h-[calc(100vh-350px)]'}`}>
            <div className="grid gap-4">
              {episodes.map((episode, index) => <div key={index} className={`bg-card border border-border rounded-lg p-4 hover:border-primary transition-all cursor-pointer ${currentEpisode?.title === episode.title ? 'border-primary bg-primary/5' : ''}`} onClick={() => playEpisode(episode)}>
                  <div className="flex gap-4">
                    {episode.imageUrl && <img src={episode.imageUrl} alt={episode.title} className="w-20 h-20 rounded-md object-cover" />}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-foreground">{episode.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2" dangerouslySetInnerHTML={{
                    __html: episode.description
                  }} />
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
                    <Button size="icon" variant={currentEpisode?.title === episode.title && isPlaying ? "default" : "outline"} onClick={e => {
                  e.stopPropagation();
                  if (currentEpisode?.title === episode.title) {
                    togglePlay();
                  } else {
                    playEpisode(episode);
                  }
                }}>
                      {currentEpisode?.title === episode.title && isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>)}
            </div>
          </ScrollArea>
        </div>
      </main>

      {/* Player fixe en bas */}
      {currentEpisode && <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
          <div className="container mx-auto px-[10px] border-muted-foreground border-0 shadow-md opacity-95 bg-[#080707] rounded py-[9px] my-0">
            {/* Barre de progression */}
            <div className="mb-4">
              <Slider value={[currentTime]} max={duration || 100} step={1} onValueChange={handleSeek} className="cursor-pointer" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="gap-[10px] px-0 flex-row flex items-center justify-center">
              {/* Info épisode */}
              

              {/* Contrôles */}
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={skipBackward}>
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button size="icon" onClick={togglePlay} className="h-12 w-12">
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={skipForward}>
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              {/* Volume */}
              {!isMobile && <div className="flex items-center gap-2 w-32">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider value={[volume]} max={100} step={1} onValueChange={value => setVolume(value[0])} />
                </div>}
            </div>
          </div>
        </div>}

      <audio ref={audioRef} />
      
      <Footer />
    </div>;
};
export default Podcasts;