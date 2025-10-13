import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchPosts, WordPressCategory, WordPressPost } from "@/lib/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import ArticleCard from "@/components/ArticleCard";
import { useState, useEffect } from "react";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data: categories = [] } = useQuery<WordPressCategory[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { data: posts = [], isLoading } = useQuery<WordPressPost[]>({
    queryKey: ['search-posts', debouncedQuery],
    queryFn: () => fetchPosts(1, 50),
    enabled: debouncedQuery.length > 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredPosts = posts.filter(post => {
    const query = debouncedQuery.toLowerCase();
    return (
      post.title.rendered.toLowerCase().includes(query) ||
      post.excerpt.rendered.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} />
      
      <main className="container mx-auto py-12 px-4 mb-20 md:mb-0">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Rechercher</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Trouvez les articles qui vous intéressent
            </p>

            <div className="max-w-2xl mx-auto relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher des articles..."
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
                  {filteredPosts.length} résultat{filteredPosts.length !== 1 ? 's' : ''} trouvé{filteredPosts.length !== 1 ? 's' : ''}
                </p>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map(post => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <SearchIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg">
                    Aucun article trouvé pour "{debouncedQuery}"
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Essayez avec d'autres mots-clés
                  </p>
                </div>
              )}
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

export default Search;
