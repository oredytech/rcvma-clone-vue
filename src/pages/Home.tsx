import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, fetchCategories, WordPressPost, WordPressCategory } from "@/lib/wordpress";
import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import CategoryFilter from "@/components/CategoryFilter";
import FeaturedSection from "@/components/FeaturedSection";
import ArticlesSlider from "@/components/ArticlesSlider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(Number(categoryParam));
    }
  }, [searchParams]);
  const {
    data: featuredPosts = []
  } = useQuery<WordPressPost[]>({
    queryKey: ['featured-posts'],
    queryFn: () => fetchPosts(1, 5)
  });
  const {
    data: posts = [],
    isLoading: postsLoading
  } = useQuery<WordPressPost[]>({
    queryKey: ['posts', page, selectedCategory],
    queryFn: () => fetchPosts(page, 12, selectedCategory || undefined)
  });
  const {
    data: categories = []
  } = useQuery<WordPressCategory[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setPage(1);
    if (categoryId) {
      setSearchParams({
        category: categoryId.toString()
      });
    } else {
      setSearchParams({});
    }
  };
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          
          
        </div>

        <ArticlesSlider posts={featuredPosts} />

        <FeaturedSection posts={featuredPosts} />

        <CategoryFilter categories={categories} selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} />

        {postsLoading && page === 1 ? <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div> : <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map(post => <ArticleCard key={post.id} post={post} />)}
            </div>

            {posts.length > 0 && posts.length % 12 === 0 && <div className="flex justify-center">
                <Button onClick={handleLoadMore} size="lg" disabled={postsLoading}>
                  {postsLoading ? <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Chargement...
                    </> : 'Charger plus d\'articles'}
                </Button>
              </div>}
          </>}

        {!postsLoading && posts.length === 0 && <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Aucun article trouvé</p>
          </div>}
      </main>

      <footer className="bg-card border-t border-border mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 RCVMA - Tous droits réservés</p>
          <p className="text-sm mt-2">Radio Communautaire de la Vie Meilleure en Action</p>
        </div>
      </footer>
    </div>;
};
export default Home;