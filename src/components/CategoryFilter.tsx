import { WordPressCategory } from "@/lib/wordpress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: WordPressCategory[];
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) => {
  return (
    <div className="bg-card rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide mb-3 text-muted-foreground">
        Catégories
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onCategorySelect(null)}
          className={cn(
            "transition-all",
            selectedCategory === null && "bg-primary text-primary-foreground"
          )}
        >
          Tous
        </Button>
        {categories.slice(0, 8).map((category) => (
          <Button
            key={category.id}
            size="sm"
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => onCategorySelect(category.id)}
            className={cn(
              "transition-all",
              selectedCategory === category.id && "bg-primary text-primary-foreground"
            )}
          >
            {category.name} ({category.count})
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
