export interface SourceCodeProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  techStack: string[];
  price: string;
  priceRaw: number; // Rp50.000 - Rp100.000
  thumbnail: string;
  screenshots: string[];
  demoLink: string;
  category: string; // SaaS, templates, etc.
}
