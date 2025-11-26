const WP_API_BASE = 'https://totalementactus.net/wp-json/wp/v2';

export interface WordPressPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  description?: string;
}

export async function fetchPosts(page = 1, perPage = 12, category?: number): Promise<WordPressPost[]> {
  try {
    let url = `${WP_API_BASE}/posts?_embed&page=${page}&per_page=${perPage}&orderby=date&order=desc`;
    if (category) {
      url += `&categories=${category}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function fetchPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(`${WP_API_BASE}/posts?slug=${slug}&_embed`);
    if (!response.ok) throw new Error('Failed to fetch post');
    const posts = await response.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function fetchCategories(): Promise<WordPressCategory[]> {
  try {
    const response = await fetch(`${WP_API_BASE}/categories?per_page=100&orderby=count&order=desc`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function stripHtml(html: string): string {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export function formatWordPressContent(html: string): string {
  if (!html) return "";
  
  let content = html;
  
  // Remplacer les <br> consécutifs par des paragraphes
  content = content.replace(/(<br\s*\/?>\s*){2,}/gi, '</p><p>');
  
  // S'assurer que les paragraphes vides sont supprimés
  content = content.replace(/<p>\s*<\/p>/g, '');
  
  // Ajouter des espaces après les paragraphes pour une meilleure lisibilité
  content = content.replace(/<\/p>/g, '</p>\n\n');
  
  // Ajouter des espaces avant et après les titres
  content = content.replace(/(<h[1-6][^>]*>)/g, '\n\n$1');
  content = content.replace(/(<\/h[1-6]>)/g, '$1\n\n');
  
  // Ajouter des espaces avant et après les blockquotes
  content = content.replace(/(<blockquote[^>]*>)/g, '\n\n$1');
  content = content.replace(/(<\/blockquote>)/g, '$1\n\n');
  
  // Ajouter des espaces avant et après les listes
  content = content.replace(/(<[ou]l[^>]*>)/g, '\n\n$1');
  content = content.replace(/(<\/[ou]l>)/g, '$1\n\n');
  
  // Ajouter des espaces avant et après les images
  content = content.replace(/(<img[^>]*>)/g, '\n\n$1\n\n');
  content = content.replace(/(<figure[^>]*>)/g, '\n\n$1');
  content = content.replace(/(<\/figure>)/g, '$1\n\n');
  
  // S'assurer que chaque ligne de liste a un espacement approprié
  content = content.replace(/<\/li>/g, '</li>\n');
  
  // Ajouter des paragraphes si le texte n'en a pas
  if (!content.includes('<p>') && !content.includes('<h') && !content.includes('<ul>') && !content.includes('<ol>')) {
    // Diviser par double saut de ligne
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
    if (paragraphs.length > 1) {
      content = paragraphs.map(p => `<p>${p.trim()}</p>`).join('\n\n');
    } else if (!content.startsWith('<')) {
      content = `<p>${content}</p>`;
    }
  }
  
  // Nettoyer les espaces multiples (sauf les sauts de ligne)
  content = content.replace(/[ \t]+/g, ' ');
  
  // Nettoyer les sauts de ligne excessifs (max 2)
  content = content.replace(/\n{3,}/g, '\n\n');
  
  return content.trim();
}
