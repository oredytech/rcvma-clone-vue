import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { WordPressPost, formatDate, stripHtml } from "@/lib/wordpress";
import CategoryBadge from "./CategoryBadge";
import { Button } from "@/components/ui/button";

interface FeaturedSectionProps {
  posts: WordPressPost[];
}

const FeaturedSection = ({ posts }: FeaturedSectionProps) => {
  if (!posts || posts.length === 0) return null;

  const latestPost = posts[0];
  const smallPosts = posts.slice(1, 5);

  const latestPostImage = latestPost._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const latestPostCategory = latestPost._embedded?.['wp:term']?.[0]?.[0];

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto lg:h-[600px]">
        {/* Left side - 4 small articles in 2x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {smallPosts.map((post) => {
            const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            const category = post._embedded?.['wp:term']?.[0]?.[0];
            
            return (
              <Link 
                key={post.id} 
                to={`/article/${post.slug}`}
                className="group relative overflow-hidden rounded-lg h-[290px] block"
              >
                <div className="absolute inset-0">
                  {featuredImage ? (
                    <img 
                      src={featuredImage} 
                      alt={stripHtml(post.title.rendered)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="relative h-full flex flex-col justify-between p-4">
                  {category && (
                    <div className="self-start">
                      <CategoryBadge name={category.name} />
                    </div>
                  )}

                  <div>
                    <h3 className="text-white font-bold text-base mb-3 line-clamp-2">
                      {stripHtml(post.title.rendered)}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-xs text-white/90">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Rédaction RCVMA</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right side - 1 large featured article */}
        <Link 
          to={`/article/${latestPost.slug}`}
          className="group relative overflow-hidden rounded-lg h-[290px] sm:h-[600px] block"
        >
          <div className="absolute inset-0">
            {latestPostImage ? (
              <img 
                src={latestPostImage} 
                alt={stripHtml(latestPost.title.rendered)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-muted" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </div>

          <div className="relative h-full flex flex-col justify-between p-6">
            {latestPostCategory && (
              <div className="self-start">
                <CategoryBadge name={latestPostCategory.name} />
              </div>
            )}

            <div>
              <h2 className="text-white font-bold text-2xl lg:text-3xl mb-4 line-clamp-3">
                {stripHtml(latestPost.title.rendered)}
              </h2>
              
              <Button 
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Lire la suite
              </Button>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedSection;
