import { useQuery } from "@tanstack/react-query";
import { fetchCategories, WordPressCategory } from "@/lib/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Clock, Radio } from "lucide-react";

const Schedule = () => {
  const { data: categories = [] } = useQuery<WordPressCategory[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const programs = [
    { time: "06:00 - 08:00", title: "Réveil Matinal", description: "Démarrez votre journée en musique et en bonne humeur" },
    { time: "08:00 - 10:00", title: "Matinale Info", description: "L'actualité du jour décryptée" },
    { time: "10:00 - 12:00", title: "Divertissement", description: "Musique et animation" },
    { time: "12:00 - 14:00", title: "Journal de Midi", description: "Toute l'actualité en direct" },
    { time: "14:00 - 16:00", title: "Après-midi Culturel", description: "Culture et société" },
    { time: "16:00 - 18:00", title: "Talk-Show", description: "Débats et discussions" },
    { time: "18:00 - 20:00", title: "Soirée Musicale", description: "La meilleure musique pour votre soirée" },
    { time: "20:00 - 22:00", title: "Émission Spéciale", description: "Programmes variés" },
    { time: "22:00 - 00:00", title: "Nuit Douce", description: "Musique relaxante" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} />
      
      <main className="container mx-auto py-12 px-4 mb-20 md:mb-0">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4 text-foreground">Le Programme</h1>
            <p className="text-xl text-muted-foreground">
              Notre grille de programmes hebdomadaire
            </p>
          </div>

          <div className="space-y-4">
            {programs.map((program, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-bold text-foreground">{program.title}</h3>
                      <span className="text-sm font-semibold text-primary whitespace-nowrap">{program.time}</span>
                    </div>
                    <p className="text-muted-foreground">{program.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Radio className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Informations</h2>
            </div>
            <p className="text-muted-foreground">
              Ce programme est donné à titre indicatif et peut être modifié sans préavis. 
              Restez à l'écoute de RCVMA pour ne rien manquer de vos émissions préférées.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Schedule;
