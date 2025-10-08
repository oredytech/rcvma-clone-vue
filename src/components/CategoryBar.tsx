import { WordPressCategory, WordPressPost } from "@/lib/wordpress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/lib/wordpress";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface CategoryBarProps {
  categories: WordPressCategory[];
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
}

const CategoryBar = ({ categories, selectedCategory, onCategorySelect }: CategoryBarProps) => {
  return (
    <div className="bg-card border-b border-border mt-[5px]">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4 py-2 min-w-max">
          <Button
            size="sm"
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => onCategorySelect(null)}
            className="whitespace-nowrap"
          >
            Tous
          </Button>
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onSelect={onCategorySelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface CategoryItemProps {
  category: WordPressCategory;
  isSelected: boolean;
  onSelect: (categoryId: number) => void;
}

const CategoryItem = ({ category, isSelected, onSelect }: CategoryItemProps) => {
  const { data: posts = [] } = useQuery<WordPressPost[]>({
    queryKey: ['category-preview', category.id],
    queryFn: () => fetchPosts(1, 8, category.id),
  });

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Button
          size="sm"
          variant={isSelected ? "default" : "outline"}
          onClick={() => onSelect(category.id)}
          className="whitespace-nowrap"
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.dispatchEvent(new Event('mouseenter', { bubbles: true }));
          }}
        >
          {category.name}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-screen h-[50vh] p-4 overflow-y-auto"
        side="bottom"
        align="start"
      >
        <h3 className="font-semibold text-lg mb-4">{category.name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.slice(0, 8).map((post) => (
            <Link key={post.id} to={`/article/${post.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                  <img
                    src={post._embedded['wp:featuredmedia'][0].source_url}
                    alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-3">
                  <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                    {post.title.rendered}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {post.excerpt.rendered.replace(/<[^>]*>/g, '')}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CategoryBar;
