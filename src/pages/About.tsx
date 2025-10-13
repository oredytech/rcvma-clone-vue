import { useQuery } from "@tanstack/react-query";
import { fetchCategories, WordPressCategory } from "@/lib/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Radio, Target, Users, Heart } from "lucide-react";

const About = () => {
  const { data: categories = [] } = useQuery<WordPressCategory[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} />
      
      <main className="container mx-auto py-12 px-4 mb-20 md:mb-0">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Radio className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4 text-foreground">À propos de RCVMA</h1>
            <p className="text-xl text-muted-foreground">
              Radio Communautaire de la Vie Meilleure en Action
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Notre Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                RCVMA est une radio communautaire dédiée à l'information, l'éducation et le divertissement 
                de nos auditeurs. Nous nous engageons à promouvoir les valeurs de la communauté, à donner 
                une voix aux sans-voix et à contribuer au développement social et culturel de notre région.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Nos Valeurs
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Intégrité :</strong> Nous nous engageons à diffuser des informations vérifiées et véridiques</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Communauté :</strong> Nous plaçons les besoins de notre communauté au cœur de nos préoccupations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Excellence :</strong> Nous visons l'excellence dans tous nos programmes et services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Innovation :</strong> Nous adoptons les nouvelles technologies pour mieux servir nos auditeurs</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Notre Équipe
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Notre équipe est composée de professionnels passionnés et dévoués qui travaillent sans relâche 
                pour vous apporter le meilleur contenu radiophonique. Journalistes, animateurs, techniciens et 
                producteurs collaborent pour créer des programmes de qualité qui informent, éduquent et divertissent.
              </p>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Notre Histoire</h2>
              <p className="text-muted-foreground leading-relaxed">
                Fondée en 2015, RCVMA est née de la volonté de créer un espace médiatique au service de la 
                communauté. Au fil des années, nous avons grandi et évolué, tout en restant fidèles à notre 
                mission première : être la voix de notre communauté et contribuer à son épanouissement.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
