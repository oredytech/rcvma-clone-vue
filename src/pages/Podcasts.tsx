import { useState, useEffect } from "react";
import { Play, Pause, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaPlayer } from "@/hooks/useMediaPlayer";

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
  const isMobile = useIsMobile();
  const { activePlayer, isPlaying, podcastInfo, switchToPodcast, togglePlay } = useMediaPlayer();

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

  const playEpisode = (episode: PodcastEpisode) => {
    switchToPodcast({
      title: episode.title,
      audioUrl: episode.audioUrl,
      imageUrl: episode.imageUrl
    });
  };

  const isCurrentEpisode = (episode: PodcastEpisode) => {
    return activePlayer === 'podcast' && podcastInfo?.audioUrl === episode.audioUrl;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pb-32">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Podcasts PANA RADIO</h1>
          <p className="text-muted-foreground mb-8">Découvrez nos derniers épisodes</p>

          <ScrollArea className={`${isMobile ? 'h-[60vh]' : 'h-[calc(100vh-350px)]'}`}>
            <div className="grid gap-4">
              {episodes.map((episode, index) => (
                <div 
                  key={index} 
                  className={`bg-card border border-border rounded-lg p-4 hover:border-primary transition-all cursor-pointer ${isCurrentEpisode(episode) ? 'border-primary bg-primary/5' : ''}`} 
                  onClick={() => playEpisode(episode)}
                >
                  <div className="flex gap-4">
                    {episode.imageUrl && (
                      <img src={episode.imageUrl} alt={episode.title} className="w-20 h-20 rounded-md object-cover" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-foreground">{episode.title}</h3>
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
    </div>
  );
};

export default Podcasts;
