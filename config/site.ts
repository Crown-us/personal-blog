export const siteConfig = {
  name: "ExtensionHub",
  description:
    "Discover, compare, and install the best Chrome extensions. Trusted by 50,000+ users worldwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://extensionhub.io",
  ogImage: "/og/default.png",
  links: {
    twitter: "https://twitter.com/extensionhub",
    github: "https://github.com/extensionhub",
  },
  creator: "ExtensionHub",
  keywords: [
    "chrome extensions",
    "browser extensions",
    "productivity tools",
    "chrome web store",
    "extension reviews",
  ],
};

export type SiteConfig = typeof siteConfig;
