import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/lib/wordpress";
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
const BreakingNews = () => {
  const {
    data: posts = []
  } = useQuery({
    queryKey: ['breaking-news'],
    queryFn: () => fetchPosts(1, 5)
  });
  if (posts.length === 0) return null;
  return <div className="bg-destructive text-destructive-foreground overflow-hidden border-t border-white/10">
      <div className="container mx-auto px-4 opacity-100">
        <div className="flex items-center gap-4 h-10 bg-destructive">
          <div className="flex items-center gap-2 whitespace-nowrap font-bold text-sm bg-accent px-[10px] py-[10px]">
            <Flame className="h-4 w-4" />
            BREAKING NEWS
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee flex gap-8 whitespace-nowrap">
              {posts.map(post => <Link key={post.id} to={`/${post.slug}`} className="hover:underline text-sm">
                  {post.title.rendered}
                </Link>)}
              {/* Duplicate pour un défilement continu */}
              {posts.map(post => <Link key={`dup-${post.id}`} to={`/${post.slug}`} className="hover:underline text-sm">
                  {post.title.rendered}
                </Link>)}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default BreakingNews;