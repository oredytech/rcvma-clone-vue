import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchPosts, WordPressCategory, WordPressPost } from "@/lib/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Folder, FileText } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import { useState } from "react";
const Categories = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const {
    data: categories = []
  } = useQuery<WordPressCategory[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  const {
    data: categoryPosts = []
  } = useQuery<WordPressPost[]>({
    queryKey: ['category-posts', selectedCategoryId],
    queryFn: () => fetchPosts(1, 12, selectedCategoryId || undefined),
    enabled: selectedCategoryId !== null
  });
  return <div className="min-h-screen bg-background">
      <Header categories={categories} />
      
      <main className="container mx-auto py-12 px-4 mb-20 md:mb-0">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">​Thématiques </h1>
            <p className="text-xl text-muted-foreground">
              Explorez nos articles par thématique
            </p>
          </div>

          {selectedCategoryId === null ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => <button key={category.id} onClick={() => setSelectedCategoryId(category.id)} className="border rounded-lg p-6 transition-all hover:shadow-lg text-left group bg-white opacity-100 border-accent">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Folder className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      {category.description && <p className="text-sm text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>}
                      <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{category.count} articles</span>
                      </div>
                    </div>
                  </div>
                </button>)}
            </div> : <div>
              <div className="mb-8">
                <button onClick={() => setSelectedCategoryId(null)} className="text-primary hover:underline mb-4">
                  ← Retour aux catégories
                </button>
                <h2 className="text-3xl font-bold text-foreground">
                  {categories.find(c => c.id === selectedCategoryId)?.name}
                </h2>
                {categories.find(c => c.id === selectedCategoryId)?.description && <p className="text-muted-foreground mt-2">
                    {categories.find(c => c.id === selectedCategoryId)?.description}
                  </p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryPosts.map(post => <ArticleCard key={post.id} post={post} />)}
              </div>

              {categoryPosts.length === 0 && <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucun article dans cette catégorie</p>
                </div>}
            </div>}
        </div>
      </main>

      <Footer />
    </div>;
};
export default Categories;