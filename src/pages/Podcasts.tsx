import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Pause, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  slug: string;
}

// Generate slug from title
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const Podcasts = () => {
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [channelImage, setChannelImage] = useState<string>("");
  const isMobile = useIsMobile();
  const { activePlayer, isPlaying, podcastInfo, togglePlay } = useMediaPlayer();

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
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
      } catch (error) {
        console.error('Error fetching podcasts:', error);
      }
    };
    fetchPodcasts();
  }, []);

  const playEpisode = (episode: PodcastEpisode) => {
    navigate(`/podcast/${episode.slug}`);
  };

  const isCurrentEpisode = (episode: PodcastEpisode) => {
    return activePlayer === 'podcast' && podcastInfo?.audioUrl === episode.audioUrl;
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
            <div className="grid gap-3 pr-2">
              {episodes.map((episode, index) => (
                <div 
                  key={index} 
                  className={`bg-card border border-border rounded-lg p-3 hover:border-primary transition-all cursor-pointer ${isCurrentEpisode(episode) ? 'border-primary bg-primary/5' : ''}`} 
                  onClick={() => playEpisode(episode)}
                >
                  <div className="flex gap-3 items-center">
                    {/* Image à gauche */}
                    <img 
                      src={episode.imageUrl || channelImage || panaRadioLogo} 
                      alt={episode.title} 
                      className={`${isMobile ? 'w-14 h-14' : 'w-20 h-20'} rounded-md object-cover flex-shrink-0`}
                    />
                    
                    {/* Titre - sur mobile, uniquement le titre */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3 className={`font-bold text-foreground ${isMobile ? 'text-sm line-clamp-2' : 'text-lg line-clamp-2 mb-2'}`}>{episode.title}</h3>
                      
                      {/* Description et métadonnées - masquées sur mobile */}
                      {!isMobile && (
                        <>
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
                        </>
                      )}
                    </div>
                    
                    {/* Bouton play rond rouge sur mobile */}
                    <Button 
                      size="icon" 
                      variant={isCurrentEpisode(episode) && isPlaying ? "default" : "outline"} 
                      className={`flex-shrink-0 ${isMobile ? 'h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground border-none' : ''}`}
                      onClick={e => {
                        e.stopPropagation();
                        if (isCurrentEpisode(episode)) {
                          togglePlay();
                        } else {
                          playEpisode(episode);
                        }
                      }}
                    >
                      {isCurrentEpisode(episode) && isPlaying ? <Pause className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} /> : <Play className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />}
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
