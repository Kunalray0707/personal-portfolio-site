import { MetadataRoute } from 'next';
import { prisma } from '../lib/prismadb';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://portfolio-ai.pro';

  // Fetch all published portfolios
  const portfolios = await prisma.portfolio.findMany({
    where: { published: true, isPrivate: false },
    select: { slug: true, updatedAt: true }
  });

  const portfolioUrls = portfolios.map((portfolio) => ({
    url: `${baseUrl}/portfolio/${portfolio.slug}`,
    lastModified: portfolio.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  return [...staticRoutes, ...portfolioUrls];
}
