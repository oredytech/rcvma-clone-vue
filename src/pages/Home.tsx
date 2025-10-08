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
    data: allPosts = [],
    isLoading: postsLoading
  } = useQuery<WordPressPost[]>({
    queryKey: ['all-posts'],
    queryFn: () => fetchPosts(1, 100)
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
      <Header categories={categories} selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} />
      
      <main className="container mx-auto py-0 px-[7px]">
        <div className="mb-8">
          
          
        </div>

        <ArticlesSlider posts={featuredPosts} />

        <FeaturedSection posts={featuredPosts} />

        {postsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-12">
            {categories.filter(cat => cat.count > 0).map((category) => {
              const categoryPosts = allPosts.filter(post => 
                post.categories.includes(category.id)
              ).slice(0, 8);

              if (categoryPosts.length === 0) return null;

              return (
                <section key={category.id}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      {category.name}
                    </h2>
                    <Button
                      variant="outline"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      Voir plus
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categoryPosts.map(post => (
                      <ArticleCard key={post.id} post={post} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
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