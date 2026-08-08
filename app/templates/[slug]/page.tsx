import { notFound } from 'next/navigation';
import { getTemplateBySlug } from '../../../lib/templates';
import { TemplateDetail } from '../../../components/templates/TemplateDetail';

interface TemplatePageProps {
  params: {
    slug: string;
  };
}

export default function TemplatePage({ params }: TemplatePageProps) {
  const template = getTemplateBySlug(params.slug);

  if (!template) {
    notFound();
  }

  return (
    <main className="container mx-auto px-6 py-10 sm:px-8 lg:px-10">
      <TemplateDetail template={template} />
    </main>
  );
}
