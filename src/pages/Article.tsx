import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPostBySlug, formatDate, formatWordPressContent, WordPressPost, incrementArticleViews, getArticleViews } from "@/lib/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryBadge from "@/components/CategoryBadge";
import ArticleSidebar from "@/components/ArticleSidebar";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Loader2, Eye } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [views, setViews] = useState(0);

  const { data: post, isLoading, error } = useQuery<WordPressPost | null>({
    queryKey: ['post', slug],
    queryFn: () => fetchPostBySlug(slug!),
    enabled: !!slug,
  });

  useEffect(() => {
    if (error || (!isLoading && !post)) {
      // Ne pas rediriger si c'est une route statique
      const staticRoutes = ['a-propos', 'contacts', 'categories', 'rechercher', 'equipe', 'programme', 'confidentialite', 'conditions', 'tv-direct', 'podcasts'];
      if (slug && !staticRoutes.includes(slug)) {
        navigate('/404');
      }
    }
  }, [error, isLoading, post, navigate, slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Incrémenter les vues lors du chargement de l'article
  useEffect(() => {
    if (post?.id) {
      const newViews = incrementArticleViews(post.id);
      setViews(newViews);
    }
  }, [post?.id]);

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
  const plainDescription = post.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 160) || "";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={`${post.title.rendered.replace(/<[^>]*>/g, '')} - PANA RADIO`}
        description={plainDescription}
        image={featuredImage || "https://panaradio.net/wp-content/uploads/2024/02/cropped-PANA-RADIO-5-1.png"}
        type="article"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <div className={`${isMobile ? 'flex flex-col gap-6' : 'grid grid-cols-1 lg:grid-cols-3 gap-8'}`}>
          <div className={isMobile ? '' : 'lg:col-span-2'}>
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

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category) => (
                    <Link key={category.id} to={`/?category=${category.id}`}>
                      <CategoryBadge name={category.name} />
                    </Link>
                  ))}
                </div>

                <h1 
                  className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />

                <div className="flex items-center gap-4 text-muted-foreground mb-8 pb-6 border-b border-border">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{formatDate(post.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="text-sm">{views} vue{views !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div 
                  className="prose prose-base md:prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-foreground prose-headings:mt-8 prose-headings:mb-4
                    prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg
                    prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-6 prose-p:mt-0 prose-p:text-justify
                    prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-foreground prose-strong:font-bold
                    prose-em:text-foreground prose-em:italic
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:mt-6 prose-ul:space-y-2
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-ol:mt-6 prose-ol:space-y-2
                    prose-li:text-foreground prose-li:leading-relaxed prose-li:mb-2
                    prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 prose-img:w-full
                    prose-blockquote:border-l-4 prose-blockquote:border-primary 
                    prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4 
                    prose-blockquote:italic prose-blockquote:text-muted-foreground 
                    prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-lg prose-blockquote:my-6
                    prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-6
                    prose-hr:border-border prose-hr:my-8
                    prose-table:border-collapse prose-table:w-full prose-table:my-6
                    prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-3 prose-th:font-bold
                    prose-td:border prose-td:border-border prose-td:p-3
                    [&>p]:mb-6 [&>p]:mt-0 [&>p]:block"
                  dangerouslySetInnerHTML={{ __html: formatWordPressContent(post.content.rendered) }}
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
          </div>

          {!isMobile && (
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ArticleSidebar currentPostId={post.id} />
              </div>
            </div>
          )}
        </div>

        {isMobile && (
          <div className="mt-8">
            <ArticleSidebar currentPostId={post.id} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Article;
