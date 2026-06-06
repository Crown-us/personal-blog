import { Extension, ExtensionWithDetails } from "@/types/extension";
import { Review } from "@/types/review";

export interface MockBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
  publishedAt: string;
  isFeatured?: boolean;
}

export const mockExtensions: ExtensionWithDetails[] = [
  {
    id: "ext-1",
    slug: "chatgpt-sidebar",
    chromeStoreId: "chatgpt-sidebar-id",
    name: "ChatGPT Sidebar & File Uploader",
    tagline: "Access ChatGPT 4o, Claude 3.5, and Gemini Pro instantly in any tab. Upload large PDF & doc files directly.",
    description: "Unleash the power of AI side-by-side with your browsing. ChatGPT Sidebar integrates advanced model capabilities directly into your browser side panel. Summarize articles, explain complex code, draft emails, and translate pages on the fly. Version 2.4 adds direct file uploads (PDFs, DOCX, CSV) and automatic OCR capabilities for images. Designed for developers, researchers, and content creators looking to double their efficiency.",
    logoUrl: "🤖",
    websiteUrl: "https://chatgptsidebar.io",
    chromeStoreUrl: "https://chromewebstore.google.com",
    affiliateUrl: "https://chatgptsidebar.io/ref=extensionhub",
    status: "featured",
    isFeatured: true,
    isSponsored: false,
    categoryId: "ai-tools",
    categorySlug: "ai-tools",
    categoryName: "AI Tools",
    version: "2.4.2",
    totalUsers: 245000,
    weeklyUsers: 42000,
    avgRating: 4.85,
    totalReviews: 1420,
    totalInstalls: 98000,
    clickCount: 12450,
    metaTitle: "ChatGPT Sidebar - Chrome AI Assistant Extension",
    metaDescription: "Access ChatGPT, Claude, and Gemini in any tab. PDF parser and AI helper in your sidebar.",
    tags: ["AI", "Productivity", "ChatGPT", "Claude", "File Parser"],
    permissions: ["sidePanel", "activeTab", "storage"],
    pricingType: "freemium",
    price: 9.99,
    trustBadge: "Best For Developers",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2026-05-20T00:00:00Z",
    screenshots: [
      { id: "s1-1", extensionId: "ext-1", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60", altText: "Sidebar interface inside Google Search", sortOrder: 0 },
      { id: "s1-2", extensionId: "ext-1", url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60", altText: "AI File Uploader panel parsing document", sortOrder: 1 },
      { id: "s1-3", extensionId: "ext-1", url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60", altText: "Instant translator settings screen", sortOrder: 2 }
    ]
  },
  {
    id: "ext-2",
    slug: "grammarly-go",
    chromeStoreId: "grammarly-go-id",
    name: "Grammarly: Writing & AI Assist",
    tagline: "Improve your writing style, fix grammar errors, and generate replies with AI writing assistance.",
    description: "From emails to social media, Grammarly helps you write clearly and confidently. It goes way beyond traditional grammar checkers, offering contextual spell check, punctuation correction, tone detection, and rewrite suggestions. The integrated GrammarlyGO feature lets you compose, rewrite, brainstorm, and reply with custom AI prompts tailored to your context and intent.",
    logoUrl: "✍️",
    websiteUrl: "https://grammarly.com",
    chromeStoreUrl: "https://chromewebstore.google.com",
    status: "approved",
    isFeatured: false,
    isSponsored: true,
    sponsorshipTier: "premium",
    sponsorshipExpiresAt: "2026-12-31T00:00:00Z",
    categoryId: "writing",
    categorySlug: "writing",
    categoryName: "Writing",
    version: "14.2.1",
    totalUsers: 10000000,
    weeklyUsers: 1200000,
    avgRating: 4.72,
    totalReviews: 42300,
    totalInstalls: 2300000,
    clickCount: 8520,
    metaTitle: "Grammarly Chrome Extension - Free Writing Tool",
    metaDescription: "Check grammar, spelling, and tone directly in your browser. Complete writing assistant.",
    tags: ["Writing", "Grammar", "Spelling", "AI", "Editor"],
    permissions: ["tabs", "contextMenus", "storage"],
    pricingType: "freemium",
    price: 15.00,
    trustBadge: "Editor Approved",
    createdAt: "2019-06-12T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
    screenshots: [
      { id: "s2-1", extensionId: "ext-2", url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=60", altText: "Grammarly interface showing edit cards", sortOrder: 0 },
      { id: "s2-2", extensionId: "ext-2", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60", altText: "GrammarlyGO AI writing helper prompt panel", sortOrder: 1 }
    ]
  },
  {
    id: "ext-3",
    slug: "languagetool-grammar",
    chromeStoreId: "languagetool-id",
    name: "LanguageTool: Multilingual Grammar",
    tagline: "Open-source spelling and grammar checker supporting 30+ languages. Excellent privacy-focused alternative.",
    description: "An open-source, private writing companion. LanguageTool detects many errors that simple spell checkers cannot, such as grammar issues, style problems, and word choice confusions. Unlike other extensions, LanguageTool prioritizes your privacy, requiring no account to start and processing text securely without logging user data.",
    logoUrl: "🦉",
    websiteUrl: "https://languagetool.org",
    chromeStoreUrl: "https://chromewebstore.google.com",
    status: "approved",
    isFeatured: false,
    isSponsored: false,
    categoryId: "writing",
    categorySlug: "writing",
    categoryName: "Writing",
    version: "8.6.0",
    totalUsers: 3000000,
    weeklyUsers: 450000,
    avgRating: 4.68,
    totalReviews: 8900,
    totalInstalls: 540000,
    clickCount: 3410,
    metaTitle: "LanguageTool Grammar Checker - Privacy Spell Check",
    metaDescription: "Open-source spelling and grammar helper supporting multiple languages. Safe and secure.",
    tags: ["Writing", "Grammar", "Open Source", "Multilingual", "Privacy"],
    permissions: ["contextMenus", "storage"],
    pricingType: "freemium",
    price: 4.99,
    trustBadge: "Best For Students",
    createdAt: "2021-02-18T00:00:00Z",
    updatedAt: "2026-05-10T00:00:00Z",
    screenshots: [
      { id: "s3-1", extensionId: "ext-3", url: "https://images.unsplash.com/photo-1546074177-ffedd79d424c?w=800&auto=format&fit=crop&q=60", altText: "Multilingual correction popup", sortOrder: 0 }
    ]
  },
  {
    id: "ext-4",
    slug: "loom-screen-recorder",
    chromeStoreId: "loom-id",
    name: "Loom: Screen Recorder & Video Share",
    tagline: "Record your screen and camera with one click. Share videos instantly using automatically copied links.",
    description: "The fastest way to explain anything with video. Record your screen, camera, microphone, and internal audio with custom overlays. As soon as you hit stop, your video is uploaded and a shareable link is copied directly to your clipboard. Send Loom videos to your team, clients, or prospects to save meetings and clarify complex concepts.",
    logoUrl: "🎥",
    websiteUrl: "https://loom.com",
    chromeStoreUrl: "https://chromewebstore.google.com",
    status: "featured",
    isFeatured: true,
    isSponsored: false,
    categoryId: "productivity",
    categorySlug: "productivity",
    categoryName: "Productivity",
    version: "5.12.0",
    totalUsers: 8000000,
    weeklyUsers: 950000,
    avgRating: 4.62,
    totalReviews: 12500,
    totalInstalls: 1800000,
    clickCount: 6120,
    metaTitle: "Loom Screen Recorder Chrome Extension",
    metaDescription: "Record screen and camera instantly. Send links to share videos instead of typing emails.",
    tags: ["Video", "Productivity", "Screen Recorder", "Collaboration"],
    permissions: ["tabCapture", "activeTab", "storage", "notifications"],
    pricingType: "freemium",
    price: 10.00,
    trustBadge: "Community Favorite",
    createdAt: "2018-09-01T00:00:00Z",
    updatedAt: "2026-05-28T00:00:00Z",
    screenshots: [
      { id: "s4-1", extensionId: "ext-4", url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60", altText: "Recording canvas options", sortOrder: 0 }
    ]
  },
  {
    id: "ext-5",
    slug: "ublock-origin-secure",
    chromeStoreId: "ublock-id",
    name: "uBlock Origin: Ultimate Content Blocker",
    tagline: "An efficient, open-source content blocker. Easy on CPU memory while blocking trackers and ads.",
    description: "Unlike other adblockers, uBlock Origin does not participate in any 'Acceptable Ads' programs. It blocks ads, trackers, malware domains, and popups out of the box using community-curated filter lists. Extremely lightweight, it uses minimal memory and CPU resources, making your browsing faster and safer.",
    logoUrl: "🛡️",
    websiteUrl: "https://github.com/gorhill/uBlock",
    chromeStoreUrl: "https://chromewebstore.google.com",
    status: "approved",
    isFeatured: true,
    isSponsored: false,
    categoryId: "privacy-security",
    categorySlug: "privacy-security",
    categoryName: "Privacy & Security",
    version: "1.58.0",
    totalUsers: 40000000,
    weeklyUsers: 12000000,
    avgRating: 4.91,
    totalReviews: 96000,
    totalInstalls: 8500000,
    clickCount: 19820,
    metaTitle: "uBlock Origin - Best Free Ad Blocker Extension",
    metaDescription: "Fast, efficient ad blocker and tracker preventer. Open source and lightweight.",
    tags: ["Privacy", "Security", "Adblock", "Open Source", "Tracker Blocker"],
    permissions: ["webRequest", "webRequestBlocking", "all_urls", "storage"],
    pricingType: "free",
    trustBadge: "Trending This Week",
    createdAt: "2015-04-20T00:00:00Z",
    updatedAt: "2026-06-03T00:00:00Z",
    screenshots: [
      { id: "s5-1", extensionId: "ext-5", url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60", altText: "uBlock popup display dashboard showing blocked items", sortOrder: 0 }
    ]
  },
  {
    id: "ext-6",
    slug: "wappalyzer-tech-detector",
    chromeStoreId: "wappalyzer-id",
    name: "Wappalyzer - Technology Profiler",
    tagline: "Find out what websites are built with instantly. Detect CMS, libraries, servers, and widgets.",
    description: "Wappalyzer is a utility that uncovers the technologies used on websites. It detects content management systems, ecommerce platforms, web frameworks, server software, analytics tools and much more. Essential for developers, designers, product managers, and sales teams doing competitive research.",
    logoUrl: "💻",
    websiteUrl: "https://wappalyzer.com",
    chromeStoreUrl: "https://chromewebstore.google.com",
    status: "approved",
    isFeatured: false,
    isSponsored: false,
    categoryId: "developer-tools",
    categorySlug: "developer-tools",
    categoryName: "Developer Tools",
    version: "6.10.4",
    totalUsers: 2500000,
    weeklyUsers: 380000,
    avgRating: 4.65,
    totalReviews: 2450,
    totalInstalls: 410000,
    clickCount: 4210,
    metaTitle: "Wappalyzer Chrome Tech Detector Extension",
    metaDescription: "See the software stacks and libraries behind any webpage. Instant competitive analysis.",
    tags: ["Developer", "Analyzer", "Tech Stack", "CMS Detector"],
    permissions: ["webNavigation", "tabs", "storage"],
    pricingType: "freemium",
    price: 29.00,
    trustBadge: "Best For Developers",
    createdAt: "2016-11-04T00:00:00Z",
    updatedAt: "2026-04-12T00:00:00Z",
    screenshots: [
      { id: "s6-1", extensionId: "ext-6", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60", altText: "Technology stack listing panel on website", sortOrder: 0 }
    ]
  },
  {
    id: "ext-7",
    slug: "octotree-github-code-tree",
    chromeStoreId: "octotree-id",
    name: "Octotree: GitHub Code Tree",
    tagline: "GitHub on steroids. Visual file tree for fast repository browsing and code reviews.",
    description: "Browser extension that enhances GitHub repository browsing. It displays a fast, interactive sidebar folder tree that lets developers browse source codes, search files, and check merge requests without constant page reloads. Trusted by over 1 million software developers.",
    logoUrl: "🌲",
    websiteUrl: "https://octotree.io",
    chromeStoreUrl: "https://chromewebstore.google.com",
    status: "approved",
    isFeatured: true,
    isSponsored: false,
    categoryId: "developer-tools",
    categorySlug: "developer-tools",
    categoryName: "Developer Tools",
    version: "8.3.1",
    totalUsers: 1200000,
    weeklyUsers: 210000,
    avgRating: 4.81,
    totalReviews: 3400,
    totalInstalls: 450000,
    clickCount: 11200,
    metaTitle: "Octotree Chrome Extension - GitHub File Browser",
    metaDescription: "Visual file tree sidebar for GitHub repository navigation. Explores source code structures easily.",
    tags: ["GitHub", "DevTools", "Code Browser", "Repository"],
    permissions: ["tabs", "storage", "declarativeContent"],
    pricingType: "freemium",
    price: 4.99,
    trustBadge: "Best For Developers",
    createdAt: "2020-04-12T00:00:00Z",
    updatedAt: "2026-05-18T00:00:00Z",
    screenshots: [
      { id: "s7-1", extensionId: "ext-7", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60", altText: "Octotree folder tree panel inside GitHub repository screen", sortOrder: 0 }
    ]
  },
  {
    id: "ext-8",
    slug: "daily-dev-news-aggregator",
    chromeStoreId: "dailydev-id",
    name: "daily.dev: Developer News",
    tagline: "The easiest way to stay updated on tech news. Curated feeds for software engineers.",
    description: "Upgrade your new tab browser screen to a personalized, highly curated news reader. It aggregates engineering posts, tutorials, release updates, and developer guides from hundreds of major tech portals (Medium, Hacker News, Dev.to, GitHub). Customizable tags and zero-tracking privacy settings.",
    logoUrl: "🔥",
    websiteUrl: "https://daily.dev",
    chromeStoreUrl: "https://chromewebstore.google.com",
    status: "featured",
    isFeatured: true,
    isSponsored: false,
    categoryId: "productivity",
    categorySlug: "productivity",
    categoryName: "Productivity",
    version: "3.14.0",
    totalUsers: 900000,
    weeklyUsers: 180000,
    avgRating: 4.88,
    totalReviews: 2900,
    totalInstalls: 320000,
    clickCount: 9500,
    metaTitle: "daily.dev Chrome Extension - Tech News Aggregator",
    metaDescription: "Read the best software developer blogs, engineering releases, and tech trends in your new tab.",
    tags: ["News", "Productivity", "Blogs", "Tech Feeds"],
    permissions: ["storage", "alarms"],
    pricingType: "free",
    trustBadge: "Trending This Week",
    createdAt: "2021-09-05T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
    screenshots: [
      { id: "s8-1", extensionId: "ext-8", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60", altText: "daily.dev new tab feed dashboard with tech articles", sortOrder: 0 }
    ]
  },
  {
    id: "ext-9",
    slug: "clear-cache-dev",
    chromeStoreId: "clearcache-id",
    name: "Clear Cache: One-Click Cleaner",
    tagline: "Clear browser cookies, storage, cache, and history with a single click.",
    description: "A lightweight utility tool designed for web developers. Instantly clears app caches, active cookie files, HTML5 local storage, database files, and downloads with one click from the browser toolbar. Fully configurable to keep specific cookie sessions while purging others.",
    logoUrl: "🧹",
    websiteUrl: "https://clear-cache.io",
    chromeStoreUrl: "https://chromewebstore.google.com",
    status: "approved",
    isFeatured: false,
    isSponsored: false,
    categoryId: "developer-tools",
    categorySlug: "developer-tools",
    categoryName: "Developer Tools",
    version: "2.1.4",
    totalUsers: 3000000,
    weeklyUsers: 400000,
    avgRating: 4.75,
    totalReviews: 1200,
    totalInstalls: 1500000,
    clickCount: 5400,
    metaTitle: "Clear Cache Dev Extension - One Click Cookies Cleaner",
    metaDescription: "Purge web browsing files, store items, local storage databases, and caches in 1-click.",
    tags: ["Cache", "DevTools", "Clear Cache", "Storage"],
    permissions: ["browsingData", "storage"],
    pricingType: "free",
    trustBadge: "Best For Developers",
    createdAt: "2017-02-14T00:00:00Z",
    updatedAt: "2026-04-20T00:00:00Z",
    screenshots: [
      { id: "s9-1", extensionId: "ext-9", url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60", altText: "Clear cache options configuration screen", sortOrder: 0 }
    ]
  },
  {
    id: "ext-10",
    slug: "session-buddy-tab-manager",
    chromeStoreId: "sessionbuddy-id",
    name: "Session Buddy: Tab Manager",
    tagline: "A unified tab explorer and session manager. Save open tabs and restore them.",
    description: "A clean, fast session manager for power users. It allows developers to save groups of open browser tabs as custom sessions, search through active tabs across windows, and recover tabs after system crashes. Great for organizing documentation tabs during project switches.",
    logoUrl: "🗂️",
    websiteUrl: "https://sessionbuddy.com",
    chromeStoreUrl: "https://chromewebstore.google.com",
    status: "approved",
    isFeatured: false,
    isSponsored: false,
    categoryId: "productivity",
    categorySlug: "productivity",
    categoryName: "Productivity",
    version: "4.0.2",
    totalUsers: 1500000,
    weeklyUsers: 250000,
    avgRating: 4.82,
    totalReviews: 4500,
    totalInstalls: 680000,
    clickCount: 8100,
    metaTitle: "Session Buddy Tab Manager - Save browser tabs",
    metaDescription: "Consolidate your open pages, save stack traces, and recover window sessions cleanly.",
    tags: ["Tabs", "Productivity", "Session Manager", "Tab Saver"],
    permissions: ["tabs", "sessions", "storage"],
    pricingType: "free",
    trustBadge: "Editor Approved",
    createdAt: "2016-08-20T00:00:00Z",
    updatedAt: "2026-05-10T00:00:00Z",
    screenshots: [
      { id: "s10-1", extensionId: "ext-10", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60", altText: "Session Buddy dashboard organizing tab list", sortOrder: 0 }
    ]
  }
];

export const mockReviews: Record<string, Review[]> = {
  "ext-1": [
    {
      id: "r1-1",
      extensionId: "ext-1",
      userId: "u-1",
      userName: "Alex Rivers",
      userAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
      rating: 5,
      title: "Essential for my daily developer workflow",
      body: "Having ChatGPT and Claude right in my side panel saves me from switching tabs 50 times a day. The file uploader handles my code exports flawlessly. Absolutely worth the upgrade.",
      pros: ["Double AI models (Claude + ChatGPT)", "Excellent side-panel integration", "Smooth file parser"],
      cons: ["Needs API key for custom models in free version"],
      verified: true,
      helpfulVotes: 24,
      status: "approved",
      createdAt: "2026-05-22T12:00:00Z",
      updatedAt: "2026-05-22T12:00:00Z"
    },
    {
      id: "r1-2",
      extensionId: "ext-1",
      userId: "u-2",
      userName: "Siti Rahma",
      userAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
      rating: 4,
      title: "Extremely fast, but needs better history sync",
      body: "I love the UI and OCR parser. However, my chat history sometimes fails to sync when I switch browsers. Highly recommend nonetheless.",
      pros: ["Quick shortcuts", "OCR works perfectly"],
      cons: ["History sync issues"],
      verified: false,
      helpfulVotes: 7,
      status: "approved",
      createdAt: "2026-05-18T10:30:00Z",
      updatedAt: "2026-05-18T10:30:00Z"
    }
  ],
  "ext-2": [
    {
      id: "r2-1",
      extensionId: "ext-2",
      userId: "u-3",
      userName: "John Miller",
      userAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60",
      rating: 5,
      title: "Indispensable writing tool",
      body: "Grammarly is running everywhere in my browser. The tone checker is a lifesaver for professional emails. The pricing is steep, but the utility is unparalleled.",
      pros: ["Best-in-class correction", "Polishes tone", "Works in almost all web text boxes"],
      cons: ["Expensive monthly tier"],
      verified: true,
      helpfulVotes: 42,
      status: "approved",
      createdAt: "2026-06-02T14:20:00Z",
      updatedAt: "2026-06-02T14:20:00Z"
    }
  ]
};

import { SourceCodeProduct } from "@/types/source-code";

export interface MockBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
  publishedAt: string;
  isFeatured?: boolean;
  relatedExtensionIds?: string[];
  relatedSourceCodeIds?: string[];
}

export const mockBlogPosts: MockBlogPost[] = [
  {
    id: "post-1",
    slug: "how-to-build-rt-rw-management-app",
    title: "How To Build an RT/RW Management App",
    excerpt: "Learn how to build a complete neighborhood management portal using Next.js and Supabase.",
    content: "Building management platforms for local communities requires careful planning of authentication, role systems (admin, citizen), and message broadcasting. In this tutorial, we will walk you through setting up a neighborhood management system step-by-step. We'll implement user invitation codes, finance tracking panels, and automated WhatsApp alert integrations...",
    coverImageUrl: "https://images.unsplash.com/photo-1546074177-ffedd79d424c?w=1200&auto=format&fit=crop&q=80",
    category: "Tutorials",
    tags: ["Tutorials", "Next.js", "Laravel"],
    readingTimeMinutes: 8,
    publishedAt: "2026-06-05T08:00:00Z",
    isFeatured: true,
    relatedSourceCodeIds: ["sc-1"]
  },
  {
    id: "post-2",
    slug: "nextjs-authentication-guide",
    title: "Next.js Authentication Guide",
    excerpt: "Step-by-step tutorial implementing secure OAuth and magic links using Supabase Auth.",
    content: "Secure user sessions are the baseline of any modern SaaS project. In this guide, we walk through setting up Next.js 16 with Supabase Auth, using cookies to synchronize sessions. We cover magic links, Google logins, middleware route protections, and managing auth states on the client side smoothly...",
    coverImageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80",
    category: "Tutorials",
    tags: ["Tutorials", "Next.js", "SaaS"],
    readingTimeMinutes: 5,
    publishedAt: "2026-06-03T10:00:00Z",
    relatedSourceCodeIds: ["sc-2"]
  },
  {
    id: "post-3",
    slug: "chrome-extension-development-basics",
    title: "Chrome Extension Development Basics",
    excerpt: "Learn how to build your first browser popup utility using manifest V3 guidelines.",
    content: "Ever wanted to build your own sidebar or content modifier? Getting started with Chrome extension development is straightforward if you understand the boundary roles of manifest.json, background service workers, content scripts, and side-panel APIs. In this guide, we build a simple translator popup using local translation APIs...",
    coverImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    category: "Tutorials",
    tags: ["Tutorials", "Developer Tools", "Guides"],
    readingTimeMinutes: 6,
    publishedAt: "2026-06-01T11:00:00Z",
    relatedExtensionIds: ["ext-1"]
  },
  {
    id: "post-4",
    slug: "case-study-ublock-origin-memory",
    title: "Case Study: How uBlock Origin Optimizes Memory Overhead",
    excerpt: "An architectural review of how uBlock Origin keeps memory usage low while blocking millions of tracker scripts.",
    content: "Blocking ads is simple, but doing it without rendering your browser unusable is a significant technical challenge. uBlock Origin utilizes highly optimized structures for matching domain lists, avoiding high-overhead regex engines in favor of simple lookup tables. In this case study, we examine how it manages memory pages...",
    coverImageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
    category: "Case Studies",
    tags: ["Case Studies", "Adblock", "Security"],
    readingTimeMinutes: 9,
    publishedAt: "2026-05-28T09:00:00Z",
    relatedExtensionIds: ["ext-5"]
  },
  {
    id: "post-5",
    slug: "review-languagetool-vs-grammarly",
    title: "Detailed Review: LanguageTool vs Grammarly in 2026",
    excerpt: "We compare the two giants of writing assistant extensions: open-source LanguageTool vs enterprise-grade Grammarly.",
    content: "Whether you are editing academic papers or drafting client proposals, having an automated second eye is indispensable. While Grammarly has pioneered generative AI writing prompts, LanguageTool has doubled down on multilingual grammar correction and strict offline privacy guarantees. This review compares their features side-by-side...",
    coverImageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80",
    category: "Reviews",
    tags: ["Reviews", "Writing", "AI Tools"],
    readingTimeMinutes: 7,
    publishedAt: "2026-05-25T14:30:00Z",
    relatedExtensionIds: ["ext-3", "ext-2"]
  },
  {
    id: "post-6",
    slug: "manifest-v3-migration-guide",
    title: "Manifest V3 Migration Guide: Web Request to Declarative Net Request",
    excerpt: "A developer manual on migration rules, declarative rulesets, and permission changes for Chrome Extensions.",
    content: "Google Chrome's transition from Manifest V2 to V3 has introduced breaking changes, especially for privacy extensions that block network requests. Replacing the dynamic webRequest API with declarativeNetRequest requires developers to pre-define rulesets instead of intercepting headers on the fly. This guide details ruleset optimization...",
    coverImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    category: "Development Guides",
    tags: ["Development Guides", "Developer Tools", "Manifest V3"],
    readingTimeMinutes: 10,
    publishedAt: "2026-05-20T10:00:00Z",
    relatedExtensionIds: ["ext-6"]
  }
];

export const mockSourceCodes: SourceCodeProduct[] = [
  {
    id: "sc-1",
    slug: "rtrw-management-system",
    name: "RT/RW Management System",
    tagline: "Neighborhood portal featuring billing tracking, citizen data logs, and announcement boards.",
    description: "A complete, production-ready neighborhood portal system. Admin dashboard lets RT/RW coordinators upload monthly payment records, verify citizen list details, and broadcast notifications. Built with high security defaults.",
    techStack: ["Next.js", "Supabase", "Tailwind"],
    price: "Rp99.000",
    priceRaw: 99000,
    thumbnail: "🏢",
    screenshots: [
      "https://images.unsplash.com/photo-1546074177-ffedd79d424c?w=800&auto=format&fit=crop&q=60"
    ],
    demoLink: "https://demo.rtrwportal.com",
    category: "Fullstack"
  },
  {
    id: "sc-2",
    slug: "ai-blog-platform",
    name: "AI Blog Platform",
    tagline: "Generate, outline, and schedule content dynamically using OpenAI integration inside a Markdown editor.",
    description: "Write content twice as fast. AI Blog Platform connects ChatGPT outline tools directly to your draft publisher. Supports automatic tags recommendations, SEO score checklists, and dynamic page indexing.",
    techStack: ["Next.js", "PostgreSQL", "Tailwind"],
    price: "Rp79.000",
    priceRaw: 79000,
    thumbnail: "🤖",
    screenshots: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60"
    ],
    demoLink: "https://demo.aiblogwriter.com",
    category: "SaaS"
  },
  {
    id: "sc-3",
    slug: "portfolio-pro-template",
    name: "Portfolio Pro Template",
    tagline: "Minimalist, extremely fast portfolio template with high contrast developer showcases.",
    description: "Stunning developer landing page template. Clean grid sections highlighting open source project repos, blog summaries, and contact fields. Fully responsive and ready for Vercel deployment in 1-click.",
    techStack: ["React", "Tailwind", "Framer Motion"],
    price: "Rp59.000",
    priceRaw: 59000,
    thumbnail: "🎨",
    screenshots: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"
    ],
    demoLink: "https://demo.portfoliopro.com",
    category: "Templates"
  },
  {
    id: "sc-4",
    slug: "pos-management-system",
    name: "POS Management System",
    tagline: "Cashier portal system supporting inventory, receipts invoice printer sync, and sales charts.",
    description: "High performance Point-of-Sale management layout. Cashier console manages billing checklists, automatic barcode matching, and outputs sales analytics records dynamically. Ready for local store implementation.",
    techStack: ["Laravel", "MySQL", "Bootstrap"],
    price: "Rp99.000",
    priceRaw: 99000,
    thumbnail: "📊",
    screenshots: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60"
    ],
    demoLink: "https://demo.possystem.com",
    category: "Fullstack"
  }
];
