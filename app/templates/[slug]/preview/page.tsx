import { notFound } from 'next/navigation';
import { getTemplateBySlug } from '../../../../lib/templates';
import PortfolioPreview from '../../../../components/portfolio/PortfolioPreview';

export default function TemplatePreviewPage({ params }: { params: { slug: string } }) {
  const template = getTemplateBySlug(params.slug);

  if (!template) {
    notFound();
  }

  // Map the template format to the Portfolio format expected by PortfolioPreview
  const previewData = {
    title: `${template.name} Preview`,
    description: template.description,
    heroTitle: template.heroTitle,
    heroSubtitle: template.heroSubtitle,
    isPrivate: false,
    slug: 'template-preview',
    sections: template.sections,
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 rounded-2xl bg-indigo-50 border border-indigo-100 p-4 text-center dark:bg-indigo-950/30 dark:border-indigo-900/50">
          <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
            You are viewing a live preview of the <strong className="font-bold">{template.name}</strong> template.
          </p>
        </div>
        <PortfolioPreview portfolio={previewData} />
      </div>
    </main>
  );
}
