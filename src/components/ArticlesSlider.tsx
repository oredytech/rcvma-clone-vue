import { WordPressPost, stripHtml } from "@/lib/wordpress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

interface ArticlesSliderProps {
  posts: WordPressPost[];
}

const ArticlesSlider = ({ posts }: ArticlesSliderProps) => {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mb-8">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnInteraction: false,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {posts.map((post) => {
            const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            
            return (
              <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3">
                <Link 
                  to={`/article/${post.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-muted">
                    {featuredImage ? (
                      <img 
                        src={featuredImage} 
                        alt={stripHtml(post.title.rendered)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                  <h3 className="flex-1 text-sm font-semibold line-clamp-3 group-hover:text-primary transition-colors">
                    {stripHtml(post.title.rendered)}
                  </h3>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
};

export default ArticlesSlider;
