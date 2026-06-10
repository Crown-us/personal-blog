import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { extensions, blogPosts, categories, sourceCodes } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { siteConfig } from "@/config/site";

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // 1. Static Routes
  const staticRoutes = [
    "",
    "/extensions",
    "/blog",
    "/showcase",
    "/compare",
    "/bundles",
    "/submit",
    "/source-code",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Dynamic Extensions (approved & featured only)
  let extensionRoutes: MetadataRoute.Sitemap = [];
  try {
    const dbExtensions = await db
      .select({
        slug: extensions.slug,
        updatedAt: extensions.updatedAt,
      })
      .from(extensions)
      .where(
        or(
          eq(extensions.status, "approved"),
          eq(extensions.status, "featured")
        )
      );

    extensionRoutes = dbExtensions.map((ext) => ({
      url: `${baseUrl}/extensions/${ext.slug}`,
      lastModified: ext.updatedAt ? new Date(ext.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Failed to generate extension routes for sitemap:", error);
  }

  // 3. Dynamic Categories
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const dbCategories = await db
      .select({
        slug: categories.slug,
        createdAt: categories.createdAt,
      })
      .from(categories);

    categoryRoutes = dbCategories.map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: cat.createdAt ? new Date(cat.createdAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Failed to generate category routes for sitemap:", error);
  }

  // 4. Dynamic Blog Posts (published only)
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const dbBlogPosts = await db
      .select({
        slug: blogPosts.slug,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"));

    blogRoutes = dbBlogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to generate blog routes for sitemap:", error);
  }

  // 5. Dynamic Source Codes
  let sourceCodeRoutes: MetadataRoute.Sitemap = [];
  try {
    const dbSourceCodes = await db
      .select({
        slug: sourceCodes.slug,
        updatedAt: sourceCodes.updatedAt,
      })
      .from(sourceCodes);

    sourceCodeRoutes = dbSourceCodes.map((sc) => ({
      url: `${baseUrl}/source-code/${sc.slug}`,
      lastModified: sc.updatedAt ? new Date(sc.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to generate source code routes for sitemap:", error);
  }

  return [
    ...staticRoutes,
    ...extensionRoutes,
    ...categoryRoutes,
    ...blogRoutes,
    ...sourceCodeRoutes,
  ];
}
