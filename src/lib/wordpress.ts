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
  
  // Remplacer les <br> simples et multiples par des fins de paragraphes
  content = content.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '</p><p>');
  content = content.replace(/<br\s*\/?>/gi, '</p><p>');
  
  // S'assurer que chaque ligne de texte est dans un paragraphe
  if (!content.includes('<p>')) {
    // Diviser par retours à la ligne
    const lines = content.split(/\n+/).filter(line => line.trim());
    if (lines.length > 0) {
      content = lines.map(line => `<p>${line.trim()}</p>`).join('');
    }
  }
  
  // S'assurer que les paragraphes vides sont supprimés
  content = content.replace(/<p>\s*<\/p>/g, '');
  content = content.replace(/<p>(\s|&nbsp;)*<\/p>/g, '');
  
  // Nettoyer les espaces multiples à l'intérieur des paragraphes
  content = content.replace(/<p>([^<]+)<\/p>/g, (match, text) => {
    return `<p>${text.replace(/\s+/g, ' ').trim()}</p>`;
  });
  
  return content.trim();
}
