import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, fetchCategories, WordPressPost, WordPressCategory } from "@/lib/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategorySection from "@/components/CategorySection";
import FeaturedSection from "@/components/FeaturedSection";
import ArticlesSlider from "@/components/ArticlesSlider";
import { Button } from "@/components/ui/button";
const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
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
    data: categories = []
  } = useQuery<WordPressCategory[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({
        category: categoryId.toString()
      });
    } else {
      setSearchParams({});
    }
  };
  const handleViewMore = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setSearchParams({ category: categoryId.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return <div className="min-h-screen bg-background">
      <Header categories={categories} selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} />
      
      <main className="container mx-auto py-0 px-[7px]">
        <ArticlesSlider posts={featuredPosts} />

        <FeaturedSection posts={featuredPosts} />

        {selectedCategory ? (
          <div className="mt-8">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory(null);
                setSearchParams({});
              }}
              className="mb-6"
            >
              ← Retour à toutes les catégories
            </Button>
            <CategorySection
              category={categories.find(c => c.id === selectedCategory)!}
              onViewMore={handleViewMore}
            />
          </div>
        ) : (
          <div className="mt-8">
            {categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                onViewMore={handleViewMore}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>;
};
export default Home;