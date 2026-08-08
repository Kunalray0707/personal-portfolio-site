import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/prismadb';
import PublicPortfolioView from '../../../components/portfolio/PublicPortfolioView';

export default async function PublicPortfolioPage({ params }: { params: { slug: string } }) {
  const portfolio = await prisma.portfolio.findUnique({ where: { slug: params.slug } });

  if (!portfolio || !portfolio.published) {
    notFound();
  }

  const publicData = {
    title: portfolio.title,
    description: portfolio.description ?? '',
    heroTitle: portfolio.heroTitle,
    heroSubtitle: portfolio.heroSubtitle ?? '',
    slug: portfolio.slug,
    isPrivate: portfolio.isPrivate,
    content: portfolio.content as {
      sections: Array<{ id: string; type: 'text' | 'feature' | 'contact'; title: string; body?: string; imageUrl?: string }>;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <PublicPortfolioView portfolio={publicData} />
      </div>
    </main>
  );
}
