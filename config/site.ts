export const siteConfig = {
  name: "RoketDev",
  description:
    "Temukan dan unduh source code, template website, dan devtools terbaik untuk meluncurkan proyek Anda secepat roket.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://roketdev.id",
  ogImage: "/og/default.png",
  links: {
    twitter: "https://twitter.com/roketdev",
    github: "https://github.com/roketdev",
  },
  creator: "RoketDev",
  keywords: [
    "source code",
    "templates website",
    "chrome extensions",
    "devtools",
    "marketplace developer",
  ],
};

export type SiteConfig = typeof siteConfig;
