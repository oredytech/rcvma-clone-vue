import { Link } from "react-router-dom";
import { Calendar, Eye } from "lucide-react";
import { WordPressPost, formatDate, stripHtml, getArticleViews } from "@/lib/wordpress";
import CategoryBadge from "./CategoryBadge";
import { Button } from "@/components/ui/button";

interface ArticleCardProps {
  post: WordPressPost;
}

const ArticleCard = ({ post }: ArticleCardProps) => {
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const mainCategory = categories[0];
  const views = getArticleViews(post.id);
  
  return (
    <article className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <Link to={`/${post.slug}`} className="block relative overflow-hidden group">
        {featuredImage ? (
          <img 
            src={featuredImage} 
            alt={post.title.rendered}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        {mainCategory && (
          <div className="absolute top-3 left-3">
            <CategoryBadge name={mainCategory.name} />
          </div>
        )}
      </Link>
      
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/${post.slug}`}>
          <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
            {stripHtml(post.title.rendered)}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
          {stripHtml(post.excerpt.rendered)}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.date)}
            </span>
            {views > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {views}
              </span>
            )}
          </div>
          
          <Link to={`/${post.slug}`}>
            <Button size="sm" variant="ghost" className="text-primary hover:text-primary">
              Lire
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
