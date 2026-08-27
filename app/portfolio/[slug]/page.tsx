import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '../../../lib/prismadb';
import PublicPortfolioView from '../../../components/portfolio/PublicPortfolioView';
import Tracker from '../../../components/Tracker';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const portfolio = await prisma.portfolio.findUnique({ where: { slug: params.slug } });
  
  if (!portfolio || !portfolio.published) {
    return { title: 'Not Found' };
  }

  const title = portfolio.metaTitle || portfolio.title;
  const description = portfolio.metaDescription || portfolio.description || '';
  const images = portfolio.ogImageUrl ? [{ url: portfolio.ogImageUrl }] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images
    }
  };
}

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
    content: portfolio.content ? JSON.parse(portfolio.content) : { sections: [] }
  };

  return (
    <>
      {portfolio.customHeadScript && (
        <div dangerouslySetInnerHTML={{ __html: portfolio.customHeadScript }} />
      )}
      
      <main className="min-h-screen bg-slate-50 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Tracker portfolioId={portfolio.id} />
          <PublicPortfolioView portfolio={publicData} />
        </div>
      </main>

      {portfolio.customBodyScript && (
        <div dangerouslySetInnerHTML={{ __html: portfolio.customBodyScript }} />
      )}
    </>
  );
}
