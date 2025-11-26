import { useQuery } from "@tanstack/react-query";
import { fetchPosts, WordPressCategory } from "@/lib/wordpress";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CategorySectionProps {
  category: WordPressCategory;
  onViewMore: (categoryId: number) => void;
}

const CategorySection = ({ category, onViewMore }: CategorySectionProps) => {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['category-posts', category.id],
    queryFn: () => fetchPosts(1, 6, category.id),
  });

  if (isLoading) return null;
  if (posts.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          {category.name}
        </h2>
        <Button
          variant="outline"
          onClick={() => onViewMore(category.id)}
          className="gap-2"
        >
          Voir Plus
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
