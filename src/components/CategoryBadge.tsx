import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  name: string;
  className?: string;
}

const CategoryBadge = ({ name, className }: CategoryBadgeProps) => {
  return (
    <span className={cn(
      "inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide",
      "bg-primary text-primary-foreground rounded",
      className
    )}>
      {name}
    </span>
  );
};

export default CategoryBadge;
