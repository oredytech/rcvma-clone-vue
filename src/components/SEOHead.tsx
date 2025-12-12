import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead = ({ 
  title = "PANA RADIO - Radio Panafricaine basée à Goma, RDC",
  description = "PANA RADIO est une radio panafricaine basée à Goma, en RDC. Nous promouvons la paix, l'unité africaine et diffusons en swahili, wolof, lingala, français et anglais.",
  image = "https://panaradio.net/wp-content/uploads/2024/02/cropped-PANA-RADIO-5-1.png",
  url,
  type = "website"
}: SEOHeadProps) => {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (meta) {
        meta.setAttribute("content", content);
      } else {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };

    // Basic meta tags
    updateMetaTag("description", description);
    
    // Open Graph tags
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:image", image, true);
    if (url) {
      updateMetaTag("og:url", url, true);
    }
    
    // Twitter tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);
    
    // Theme color for browser
    updateMetaTag("theme-color", "#dc2626");
    updateMetaTag("msapplication-navbutton-color", "#dc2626");
    updateMetaTag("apple-mobile-web-app-status-bar-style", "#dc2626");
    
  }, [title, description, image, url, type]);

  return null;
};

export default SEOHead;
