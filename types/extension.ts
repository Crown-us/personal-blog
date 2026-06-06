export type ExtensionStatus = "pending" | "approved" | "rejected" | "featured";
export type PricingType = "free" | "freemium" | "paid";
export type SponsorshipTier = "basic" | "pro" | "premium";

export interface Extension {
  id: string;
  slug: string;
  chromeStoreId?: string;
  name: string;
  tagline?: string;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
  affiliateUrl?: string;
  chromeStoreUrl: string;
  publisherId?: string;
  categoryId?: string;
  categorySlug?: string;
  categoryName?: string;
  status: ExtensionStatus;
  isFeatured: boolean;
  isSponsored: boolean;
  sponsorshipTier?: SponsorshipTier;
  sponsorshipExpiresAt?: string;
  version?: string;
  totalUsers: number;
  weeklyUsers: number;
  avgRating: number;
  totalReviews: number;
  totalInstalls: number;
  clickCount: number;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  permissions?: string[];
  pricingType: PricingType;
  price?: number;
  trustBadge?: string;
  pros?: string[];
  cons?: string[];
  alternatives?: { name: string; slug: string; tagline: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Screenshot {
  id: string;
  extensionId: string;
  url: string;
  altText?: string;
  sortOrder: number;
}

export interface ExtensionWithDetails extends Extension {
  screenshots: Screenshot[];
  category?: { slug: string; name: string; iconName?: string };
}

export interface ExtensionListParams {
  category?: string;
  sort?: "rating" | "users" | "newest" | "installs";
  pricing?: PricingType;
  q?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}
