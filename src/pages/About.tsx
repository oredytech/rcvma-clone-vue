import { useQuery } from "@tanstack/react-query";
import { fetchCategories, WordPressCategory } from "@/lib/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Target, Users, Heart, Globe } from "lucide-react";
import panaRadioLogo from "@/assets/pana-radio-logo.png";

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
            <img src={panaRadioLogo} alt="PANA RADIO" className="h-20 w-20 mx-auto mb-4 object-contain" />
            <h1 className="text-4xl font-bold mb-4 text-foreground">À propos de PANA RADIO</h1>
            <p className="text-xl text-muted-foreground">
              Radio Panafricaine basée à Goma, RDC
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Notre Histoire
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                PANA RADIO est une radio panafricaine basée à Goma, en République Démocratique du Congo, 
                fondée par Oredy MUSANDA avec des jeunes Africains, notamment les TCR (Techniciens Chargés 
                de Reportage) d'Afrique francophone, certifiés par la bourse Claude VERLON et Ghislaine 
                DUPONT en 2020-2021 (8e édition).
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Notre Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Depuis ses débuts, la radio promeut la paix, l'unité des peuples africains, ainsi que 
                la sensibilisation à l'environnement et à la santé. Notre programmation riche inclut 
                des contenus sur la science, la technologie, la culture, la musique, et des messages 
                d'amour et de solidarité en faveur d'un développement durable et d'une Afrique unie.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                Nos Langues
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Sur sa webradio, PANA RADIO diffuse des émissions dans plusieurs langues africaines 
                majeures telles que le swahili, le wolof, le lingala, ainsi qu'en français et en anglais, 
                pour toucher un large public à travers le continent. Cette diversité linguistique fait 
                de PANA RADIO une plateforme inclusive qui valorise les diverses cultures africaines 
                tout en promouvant un dialogue panafricain.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Notre Équipe
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Notre équipe est composée de jeunes professionnels africains passionnés par le journalisme 
                et les médias. Formés aux meilleures pratiques du reportage, ils travaillent ensemble pour 
                créer des programmes de qualité qui informent, éduquent et rassemblent les peuples africains.
              </p>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contactez-nous</h2>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Téléphone :</strong> +243 996 886 079</p>
                <p><strong>Email :</strong> contact@panaradio.net</p>
                <p><strong>Adresse :</strong> Ville de Goma, Nord-Kivu, RDC</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
