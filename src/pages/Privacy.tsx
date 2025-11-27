import { useQuery } from "@tanstack/react-query";
import { fetchCategories, WordPressCategory } from "@/lib/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, UserCheck } from "lucide-react";

const Privacy = () => {
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
            <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4 text-foreground">Politique de Confidentialité</h1>
            <p className="text-xl text-muted-foreground">
              Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-primary" />
                Collecte des informations
              </h2>
              <p className="text-muted-foreground">
                Nous collectons les informations que vous nous fournissez directement lorsque vous utilisez notre site web, 
                vous inscrivez à notre newsletter, ou nous contactez. Ces informations peuvent inclure votre nom, 
                adresse email, et toute autre information que vous choisissez de partager.
              </p>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                Utilisation des informations
              </h2>
              <p className="text-muted-foreground mb-4">
                Nous utilisons les informations collectées pour:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Vous fournir nos services et améliorer votre expérience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Vous envoyer des informations et des actualités relatives à nos programmes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Répondre à vos questions et demandes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Analyser l'utilisation de notre site pour l'améliorer</span>
                </li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-primary" />
                Vos droits
              </h2>
              <p className="text-muted-foreground">
                Vous avez le droit d'accéder, de corriger, ou de supprimer vos données personnelles. 
                Pour exercer ces droits, veuillez nous contacter à l'adresse: privacy@oredymedia.org
              </p>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Cookies</h2>
              <p className="text-muted-foreground">
                Notre site utilise des cookies pour améliorer votre expérience de navigation. 
                Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.
              </p>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question concernant cette politique de confidentialité, veuillez nous contacter à:
                <br />
                <a href="mailto:privacy@oredymedia.org" className="text-primary hover:underline">privacy@oredymedia.org</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
