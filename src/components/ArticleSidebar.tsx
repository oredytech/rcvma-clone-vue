import { useQuery } from "@tanstack/react-query";
import { fetchPosts, WordPressPost, formatDate } from "@/lib/wordpress";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Twitter, Linkedin, Mail, Share2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ArticleSidebarProps {
  currentPostId: number;
}

const ArticleSidebar = ({ currentPostId }: ArticleSidebarProps) => {
  const { toast } = useToast();
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentText, setCommentText] = useState("");

  const { data: recentPosts } = useQuery<WordPressPost[]>({
    queryKey: ['recentPosts'],
    queryFn: () => fetchPosts(1, 5),
  });

  const filteredPosts = recentPosts?.filter(post => post.id !== currentPostId) || [];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Commentaire envoyé",
      description: "Votre commentaire a été soumis avec succès.",
    });
    setCommentName("");
    setCommentEmail("");
    setCommentText("");
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = document.title;
    
    let shareUrl = '';
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
        break;
    }
    
    if (platform !== 'email') {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    } else {
      window.location.href = shareUrl;
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Lien copié",
      description: "Le lien de l'article a été copié dans le presse-papiers.",
    });
  };

  return (
    <aside className="space-y-6">
      {/* Partage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleShare('facebook')}
              className="flex-1"
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleShare('twitter')}
              className="flex-1"
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleShare('linkedin')}
              className="flex-1"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleShare('email')}
              className="flex-1"
            >
              <Mail className="h-4 w-4" />
            </Button>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={copyLink}
            className="w-full mt-2"
          >
            Copier le lien
          </Button>
        </CardContent>
      </Card>

      {/* Articles récents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Articles récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPosts.slice(0, 4).map((post) => {
              const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
              return (
                <Link
                  key={post.id}
                  to={`/${post.slug}`}
                  className="flex gap-3 group"
                >
                  {featuredImage && (
                    <img
                      src={featuredImage}
                      alt={post.title.rendered}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(post.date)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de commentaire */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Laisser un commentaire</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Votre nom *"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Votre email *"
                value={commentEmail}
                onChange={(e) => setCommentEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Votre commentaire *"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                rows={4}
              />
            </div>
            <Button type="submit" className="w-full">
              Envoyer
            </Button>
          </form>
        </CardContent>
      </Card>
    </aside>
  );
};

export default ArticleSidebar;
