import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPostBySlug, formatDate, WordPressPost } from "@/lib/wordpress";
import Header from "@/components/Header";
import CategoryBadge from "@/components/CategoryBadge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: post, isLoading, error } = useQuery<WordPressPost | null>({
    queryKey: ['post', slug],
    queryFn: () => fetchPostBySlug(slug!),
    enabled: !!slug,
  });

  useEffect(() => {
    if (error || (!isLoading && !post)) {
      navigate('/404');
    }
  }, [error, isLoading, post, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const categories = post._embedded?.['wp:term']?.[0] || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <article className="bg-card rounded-lg shadow-lg overflow-hidden">
          {featuredImage && (
            <div className="w-full h-96 overflow-hidden">
              <img 
                src={featuredImage} 
                alt={post.title.rendered}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => (
                <Link key={category.id} to={`/?category=${category.id}`}>
                  <CategoryBadge name={category.name} />
                </Link>
              ))}
            </div>

            <h1 
              className="text-4xl font-bold mb-4 leading-tight"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            <div className="flex items-center text-muted-foreground mb-8 pb-6 border-b border-border">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">{formatDate(post.date)}</span>
            </div>

            <div 
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-foreground
                prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                prose-li:text-foreground prose-li:mb-2
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
                prose-blockquote:border-l-4 prose-blockquote:border-primary 
                prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
                prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </div>
        </article>

        <div className="mt-8 flex justify-center">
          <Link to="/">
            <Button size="lg">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </main>

      <footer className="bg-card border-t border-border mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 RCVMA - Tous droits réservés</p>
          <p className="text-sm mt-2">Radio Communautaire de la Vie Meilleure en Action</p>
        </div>
      </footer>
    </div>
  );
};

export default Article;
