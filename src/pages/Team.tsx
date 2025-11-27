import { useQuery } from "@tanstack/react-query";
import { fetchCategories, WordPressCategory } from "@/lib/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Calendar, FileText } from "lucide-react";

const Team = () => {
  const { data: categories = [] } = useQuery<WordPressCategory[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} />
      
      <main className="container mx-auto py-12 px-4 mb-20 md:mb-0">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4 text-foreground">Notre Équipe</h1>
            <p className="text-xl text-muted-foreground">
              Les professionnels passionnés derrière OREDY MEDIA
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-8">
              Notre équipe est composée de journalistes, animateurs, techniciens et producteurs 
              dévoués qui travaillent ensemble pour vous offrir le meilleur contenu radiophonique.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {/* Exemple de membres d'équipe */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Direction</h3>
                <p className="text-muted-foreground">
                  L'équipe de direction assure la vision stratégique et la gestion de la radio.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Rédaction</h3>
                <p className="text-muted-foreground">
                  Nos journalistes vous apportent des informations vérifiées et pertinentes.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Animation</h3>
                <p className="text-muted-foreground">
                  Des animateurs talentueux pour vous divertir et vous informer au quotidien.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Technique</h3>
                <p className="text-muted-foreground">
                  Une équipe technique qualifiée pour une diffusion de qualité optimale.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Production</h3>
                <p className="text-muted-foreground">
                  Des producteurs créatifs pour des émissions originales et captivantes.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Administration</h3>
                <p className="text-muted-foreground">
                  Le support administratif qui assure le bon fonctionnement de la radio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Team;
