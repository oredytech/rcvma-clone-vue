import { useQuery } from "@tanstack/react-query";
import { fetchCategories, WordPressCategory } from "@/lib/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, Scale, AlertCircle } from "lucide-react";

const Terms = () => {
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
            <FileText className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4 text-foreground">Conditions d'Utilisation</h1>
            <p className="text-xl text-muted-foreground">
              Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Scale className="h-6 w-6 text-primary" />
                Acceptation des conditions
              </h2>
              <p className="text-muted-foreground">
                En accédant et en utilisant le site web de RCVMA, vous acceptez d'être lié par ces conditions d'utilisation. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
              </p>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Propriété intellectuelle</h2>
              <p className="text-muted-foreground">
                Tout le contenu présent sur ce site, y compris les textes, images, logos, et enregistrements audio, 
                est la propriété de RCVMA ou de ses fournisseurs de contenu et est protégé par les lois sur la 
                propriété intellectuelle.
              </p>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Utilisation autorisée</h2>
              <p className="text-muted-foreground mb-4">
                Vous êtes autorisé à:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Consulter le contenu du site à des fins personnelles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Partager nos articles via les réseaux sociaux</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Télécharger du contenu pour une utilisation personnelle non commerciale</span>
                </li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-primary" />
                Restrictions
              </h2>
              <p className="text-muted-foreground mb-4">
                Il est interdit de:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Utiliser notre contenu à des fins commerciales sans autorisation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Modifier ou altérer le contenu du site</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Utiliser le site de manière qui pourrait l'endommager ou nuire à sa disponibilité</span>
                </li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Limitation de responsabilité</h2>
              <p className="text-muted-foreground">
                RCVMA ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation 
                ou de l'impossibilité d'utiliser ce site web.
              </p>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Modifications</h2>
              <p className="text-muted-foreground">
                RCVMA se réserve le droit de modifier ces conditions d'utilisation à tout moment. 
                Les modifications entreront en vigueur dès leur publication sur le site.
              </p>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à:
                <br />
                <a href="mailto:legal@rcvma.org" className="text-primary hover:underline">legal@rcvma.org</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
