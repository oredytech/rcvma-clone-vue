import { useQuery } from "@tanstack/react-query";
import { fetchCategories, searchPosts, WordPressCategory, WordPressPost } from "@/lib/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search as SearchIcon, Loader2, Podcast, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import ArticleCard from "@/components/ArticleCard";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useMediaPlayer } from "@/hooks/useMediaPlayer";
import { Play, Pause, Clock, Calendar } from "lucide-react";

interface PodcastEpisode {
  title: string;
  description: string;
  audioUrl: string;
  pubDate: string;
  duration: string;
  imageUrl?: string;
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [podcastsLoading, setPodcastsLoading] = useState(false);
  const { activePlayer, isPlaying, podcastInfo, switchToPodcast, togglePlay } = useMediaPlayer();

  const { data: categories = [] } = useQuery<WordPressCategory[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  // Recherche via l'API REST WordPress
  const { data: posts = [], isLoading: postsLoading } = useQuery<WordPressPost[]>({
    queryKey: ['search-posts', debouncedQuery],
    queryFn: () => searchPosts(debouncedQuery),
    enabled: debouncedQuery.length > 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Recherche de podcasts
  useEffect(() => {
    const fetchPodcasts = async () => {
      if (!debouncedQuery) {
        setPodcasts([]);
        return;
      }
      
      setPodcastsLoading(true);
      try {
        const response = await fetch('https://podcast.zenomedia.com/api/public/podcasts/e422f99f-db57-40c3-a92e-778a15e5c2bb/rss');
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const items = xml.querySelectorAll('item');
        const allEpisodes: PodcastEpisode[] = Array.from(items).map(item => ({
          title: item.querySelector('title')?.textContent || '',
          description: item.querySelector('description')?.textContent || '',
          audioUrl: item.querySelector('enclosure')?.getAttribute('url') || '',
          pubDate: item.querySelector('pubDate')?.textContent || '',
          duration: item.querySelector('itunes\\:duration, duration')?.textContent || '00:00',
          imageUrl: item.querySelector('itunes\\:image')?.getAttribute('href') || xml.querySelector('channel > itunes\\:image')?.getAttribute('href') || ''
        }));
        
        // Filtrer les podcasts par la recherche
        const query = debouncedQuery.toLowerCase();
        const filtered = allEpisodes.filter(ep => 
          ep.title.toLowerCase().includes(query) || 
          ep.description.toLowerCase().includes(query)
        );
        setPodcasts(filtered);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
      } finally {
        setPodcastsLoading(false);
      }
    };
    
    fetchPodcasts();
  }, [debouncedQuery]);

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

  const isLoading = postsLoading || podcastsLoading;
  const totalResults = posts.length + podcasts.length;

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} />
      
      <main className="container mx-auto py-12 px-4 mb-20 md:mb-0">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Rechercher</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Trouvez des articles et podcasts
            </p>

            <div className="max-w-2xl mx-auto relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher des articles, podcasts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>

          {isLoading && debouncedQuery.length > 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : debouncedQuery.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-muted-foreground">
                  {totalResults} résultat{totalResults !== 1 ? 's' : ''} trouvé{totalResults !== 1 ? 's' : ''}
                </p>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">
                    Tout ({totalResults})
                  </TabsTrigger>
                  <TabsTrigger value="articles" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Articles ({posts.length})
                  </TabsTrigger>
                  <TabsTrigger value="podcasts" className="flex items-center gap-2">
                    <Podcast className="h-4 w-4" />
                    Podcasts ({podcasts.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  {totalResults > 0 ? (
                    <div className="space-y-8">
                      {posts.length > 0 && (
                        <div>
                          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Articles
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.slice(0, 6).map(post => (
                              <ArticleCard key={post.id} post={post} />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {podcasts.length > 0 && (
                        <div>
                          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Podcast className="h-5 w-5 text-primary" />
                            Podcasts
                          </h2>
                          <div className="grid gap-4">
                            {podcasts.slice(0, 4).map((episode, index) => (
                              <PodcastCard 
                                key={index} 
                                episode={episode} 
                                isCurrentEpisode={isCurrentEpisode(episode)}
                                isPlaying={isPlaying}
                                onPlay={() => playEpisode(episode)}
                                onToggle={togglePlay}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <NoResults query={debouncedQuery} />
                  )}
                </TabsContent>

                <TabsContent value="articles">
                  {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {posts.map(post => (
                        <ArticleCard key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <NoResults query={debouncedQuery} type="articles" />
                  )}
                </TabsContent>

                <TabsContent value="podcasts">
                  {podcasts.length > 0 ? (
                    <div className="grid gap-4">
                      {podcasts.map((episode, index) => (
                        <PodcastCard 
                          key={index} 
                          episode={episode} 
                          isCurrentEpisode={isCurrentEpisode(episode)}
                          isPlaying={isPlaying}
                          onPlay={() => playEpisode(episode)}
                          onToggle={togglePlay}
                        />
                      ))}
                    </div>
                  ) : (
                    <NoResults query={debouncedQuery} type="podcasts" />
                  )}
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="text-center py-20">
              <SearchIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">
                Entrez un mot-clé pour commencer votre recherche
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Composant pour les cartes podcast
const PodcastCard = ({ episode, isCurrentEpisode, isPlaying, onPlay, onToggle }: {
  episode: PodcastEpisode;
  isCurrentEpisode: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onToggle: () => void;
}) => (
  <div 
    className={`bg-card border border-border rounded-lg p-4 hover:border-primary transition-all cursor-pointer ${isCurrentEpisode ? 'border-primary bg-primary/5' : ''}`}
    onClick={onPlay}
  >
    <div className="flex gap-4">
      {episode.imageUrl && (
        <img src={episode.imageUrl} alt={episode.title} className="w-16 h-16 rounded-md object-cover" />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-foreground truncate">{episode.title}</h3>
        <p 
          className="text-sm text-muted-foreground line-clamp-1" 
          dangerouslySetInnerHTML={{ __html: episode.description }} 
        />
        <div className="flex gap-4 text-xs text-muted-foreground mt-1">
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
        variant={isCurrentEpisode && isPlaying ? "default" : "outline"} 
        onClick={e => {
          e.stopPropagation();
          if (isCurrentEpisode) {
            onToggle();
          } else {
            onPlay();
          }
        }}
      >
        {isCurrentEpisode && isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
    </div>
  </div>
);

// Composant pour afficher aucun résultat
const NoResults = ({ query, type }: { query: string; type?: string }) => (
  <div className="text-center py-20">
    <SearchIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
    <p className="text-muted-foreground text-lg">
      Aucun {type || 'résultat'} trouvé pour "{query}"
    </p>
    <p className="text-muted-foreground text-sm mt-2">
      Essayez avec d'autres mots-clés
    </p>
  </div>
);

export default Search;
