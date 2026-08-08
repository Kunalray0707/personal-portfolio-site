'use client';
import React, { useEffect, useRef, useState } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaPlus, FaSave, FaTrash, FaUnlock, FaLock, FaUndo, FaRedo, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import PortfolioPreview from './PortfolioPreview';
import AIPanel from '../../components/ai/AIPanel';

type SectionType = 'text' | 'feature' | 'contact';

type Section = {
  id: string;
  type: SectionType;
  title: string;
  body?: string;
  bullets?: string[];
  imageUrl?: string;
};

type PortfolioDraft = {
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  isPrivate: boolean;
  password: string;
  published: boolean;
  slug: string;
  sections: Section[];
};

type PortfolioVersion = {
  id: string;
  snapshot: PortfolioDraft;
  note?: string;
  createdAt: string;
};

interface PortfolioBuilderProps {
  portfolioId: string;
}

const defaultDraft: PortfolioDraft = {
  title: 'Untitled portfolio',
  description: 'A short overview of your work and expertise.',
  heroTitle: 'Transform your portfolio into a professional brand',
  heroSubtitle: 'Build client-ready pages with sections, preview, and publishing controls.',
  isPrivate: false,
  password: '',
  published: false,
  slug: '',
  sections: [
    { id: 'section-1', type: 'text', title: 'About your work', body: 'Share what makes your portfolio unique and what problems you solve.' },
    { id: 'section-2', type: 'feature', title: 'Featured work', body: 'Showcase your most compelling projects and outcomes.', imageUrl: '' }
  ]
};

function SortableSectionItem({ section, onChange, onRemove }: { section: Section; onChange: (value: Partial<Section>) => void; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <span {...attributes} {...listeners} className="cursor-grab">☰</span>
          <span>{section.type === 'text' ? 'Text section' : section.type === 'feature' ? 'Feature grid' : 'Contact block'}</span>
        </div>
        <button type="button" onClick={onRemove} className="rounded-2xl border border-rose-200 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-200 dark:hover:bg-rose-950/70">
          <FaTrash className="w-3.5 h-3.5" /> Remove
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Section title</label>
        <input
          value={section.title}
          onChange={(event) => onChange({ title: event.target.value })}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />

        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Section content</label>
        <textarea
          value={section.body || ''}
          onChange={(event) => onChange({ body: event.target.value })}
          rows={4}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />

        {section.type === 'feature' && (
          <>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Image URL</label>
            <input
              value={section.imageUrl || ''}
              onChange={(event) => onChange({ imageUrl: event.target.value })}
              placeholder="https://example.com/image.png"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">Feature bullets</label>
            <textarea
              value={(section.bullets || []).join('\n')}
              onChange={(event) => onChange({ bullets: event.target.value.split('\n').filter(Boolean) })}
              rows={3}
              placeholder="Enter one bullet per line"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function PortfolioBuilder({ portfolioId }: PortfolioBuilderProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<PortfolioDraft>(defaultDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [versions, setVersions] = useState<PortfolioVersion[]>([]);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<PortfolioDraft[]>([]);
  const [future, setFuture] = useState<PortfolioDraft[]>([]);
  const [portfolioSlug, setPortfolioSlug] = useState('');
  const autoSaveTimer = useRef<number | null>(null);
  const firstLoad = useRef(true);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    if (!portfolioId) return;

    const loadPortfolio = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/portfolio/${portfolioId}`, { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || !data.portfolio) {
          setError(data.error || 'Portfolio not found');
          return;
        }

        const portfolio = data.portfolio;
        setDraft({
          title: portfolio.title,
          description: portfolio.description || '',
          heroTitle: portfolio.heroTitle,
          heroSubtitle: portfolio.heroSubtitle || '',
          isPrivate: portfolio.isPrivate,
          password: '',
          published: portfolio.published,
          slug: portfolio.slug,
          sections: portfolio.content?.sections ?? []
        });
        setPortfolioSlug(portfolio.slug);
        setVersions(portfolio.versions || []);
        setError('');
      } catch {
        setError('Unable to load portfolio.');
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [portfolioId]);

  const scheduleSave = () => {
    if (!draft || loading) return;
    if (autoSaveTimer.current) window.clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = window.setTimeout(saveDraft, 1200);
  };

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    scheduleSave();
    return () => {
      if (autoSaveTimer.current) window.clearTimeout(autoSaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const updateDraft = (patch: Partial<PortfolioDraft>) => {
    setDraft((current) => {
      if (!current) return current;
      setHistory((previous) => [...previous, current]);
      setFuture([]);
      return { ...current, ...patch };
    });
  };

  const updateSection = (sectionId: string, patch: Partial<Section>) => {
    setDraft((current) => {
      if (!current) return current;
      setHistory((previous) => [...previous, current]);
      setFuture([]);
      return {
        ...current,
        sections: current.sections.map((section) => (section.id === sectionId ? { ...section, ...patch } : section))
      };
    });
  };

  const addSection = (type: SectionType) => {
    const id = `section-${Date.now()}`;
    const nextSection: Section = {
      id,
      type,
      title: type === 'feature' ? 'Featured section' : type === 'contact' ? 'Contact callout' : 'New section',
      body: type === 'contact' ? 'Add your email or contact message here.' : 'Share a strong summary of your work.',
      bullets: type === 'feature' ? ['Key result one', 'Key result two', 'Key result three'] : undefined,
      imageUrl: ''
    };
    setDraft((current) => {
      if (!current) return current;
      setHistory((previous) => [...previous, current]);
      setFuture([]);
      return { ...current, sections: [...current.sections, nextSection] };
    });
  };

  const removeSection = (sectionId: string) => {
    setDraft((current) => {
      if (!current) return current;
      setHistory((previous) => [...previous, current]);
      setFuture([]);
      return { ...current, sections: current.sections.filter((section) => section.id !== sectionId) };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !draft) return;
    const oldIndex = draft.sections.findIndex((section) => section.id === active.id);
    const newIndex = draft.sections.findIndex((section) => section.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    setDraft((current) => {
      if (!current) return current;
      setHistory((previous) => [...previous, current]);
      setFuture([]);
      return {
        ...current,
        sections: arrayMove(current.sections, oldIndex, newIndex)
      };
    });
  };

  const saveDraft = async () => {
    if (!draft || !portfolioId) return;
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/portfolio/${portfolioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draft.title,
          description: draft.description,
          heroTitle: draft.heroTitle,
          heroSubtitle: draft.heroSubtitle,
          isPrivate: draft.isPrivate,
          published: draft.published,
          password: draft.password,
          sections: draft.sections
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Unable to save portfolio.');
        return;
      }
      setSavedMessage('Saved');
      setTimeout(() => setSavedMessage(''), 2000);
      setPortfolioSlug(data.portfolio.slug);
    } catch (err) {
      setError('Unable to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const saveVersion = async () => {
    if (!draft || !portfolioId) return;
    setSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/portfolio/${portfolioId}/version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshot: draft, note: `Version saved ${new Date().toLocaleString()}` })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Unable to save version.');
        return;
      }
      setVersions((current) => [data.version, ...current]);
      setSavedMessage('Version saved');
      setTimeout(() => setSavedMessage(''), 2000);
    } catch {
      setError('Failed to save version.');
    } finally {
      setSaving(false);
    }
  };

  const duplicatePortfolio = async () => {
    const response = await fetch(`/api/portfolio/${portfolioId}/duplicate`, { method: 'POST' });
    const data = await response.json();
    if (response.ok && data.portfolio) {
      router.push(`/dashboard/portfolios/${data.portfolio.id}`);
    } else {
      setError(data.error || 'Unable to duplicate portfolio.');
    }
  };

  const deletePortfolio = async () => {
    if (!window.confirm('Are you sure you want to delete this portfolio?')) return;
    const response = await fetch(`/api/portfolio/${portfolioId}`, { method: 'DELETE' });
    const data = await response.json();
    if (response.ok) {
      router.push('/dashboard/portfolios');
    } else {
      setError(data.error || 'Unable to delete portfolio.');
    }
  };

  const undo = () => {
    setHistory((currentHistory) => {
      if (currentHistory.length === 0 || !draft) return currentHistory;
      const previous = currentHistory[currentHistory.length - 1];
      setFuture((previousFuture) => [draft, ...previousFuture]);
      setDraft(previous);
      return currentHistory.slice(0, -1);
    });
  };

  const redo = () => {
    setFuture((currentFuture) => {
      if (currentFuture.length === 0 || !draft) return currentFuture;
      const nextState = currentFuture[0];
      setHistory((currentHistory) => [...currentHistory, draft]);
      setDraft(nextState);
      return currentFuture.slice(1);
    });
  };

  const restoreVersion = (snapshot: PortfolioDraft) => {
    setHistory((previous) => [...previous, draft]);
    setFuture([]);
    setDraft(snapshot);
  };

  if (!portfolioId) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-500 dark:text-slate-300">No portfolio selected.</div>;
  }

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-500 dark:text-slate-300">Loading builder…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Portfolio builder</p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Edit your portfolio</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Autosave is enabled and changes are stored automatically.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={undo} disabled={history.length === 0} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              <FaUndo className="w-4 h-4" /> Undo
            </button>
            <button type="button" onClick={redo} disabled={future.length === 0} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              <FaRedo className="w-4 h-4" /> Redo
            </button>
            <button type="button" onClick={saveVersion} className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
              <FaSave className="w-4 h-4" /> Save version
            </button>
            <button type="button" onClick={duplicatePortfolio} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              <FaCopy className="w-4 h-4" /> Duplicate
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span>{draft.published ? 'Published' : 'Draft'}</span>
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          <span>{draft.isPrivate ? 'Password protected' : 'Public access enabled'}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {saving ? 'Saving…' : savedMessage || 'Up to date'}
          </span>
        </div>
      </div>

      {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="grid gap-6">
          <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Portfolio details</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your title, description, and publish settings.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => updateDraft({ published: !draft.published })} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                  {draft.published ? 'Unpublish' : 'Publish'}
                </button>
                <button type="button" onClick={() => updateDraft({ isPrivate: !draft.isPrivate })} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                  {draft.isPrivate ? <><FaLock className="w-4 h-4" /> Private</> : <><FaUnlock className="w-4 h-4" /> Public</>}
                </button>
                <button type="button" onClick={deletePortfolio} className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 transition hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/70 dark:text-rose-200 dark:hover:bg-rose-900">
                  Delete portfolio
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Portfolio title</label>
                <input value={draft.title} onChange={(event) => updateDraft({ title: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Portfolio description</label>
                <textarea value={draft.description} onChange={(event) => updateDraft({ description: event.target.value })} rows={3} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Hero title</label>
                <input value={draft.heroTitle} onChange={(event) => updateDraft({ heroTitle: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Hero subtitle</label>
                <input value={draft.heroSubtitle} onChange={(event) => updateDraft({ heroSubtitle: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
              </div>

              {draft.isPrivate && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password for private access</label>
                  <input
                    type="password"
                    value={draft.password}
                    onChange={(event) => updateDraft({ password: event.target.value })}
                    placeholder="Enter a secure password"
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              )}

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                <p className="text-sm text-slate-500 dark:text-slate-400">Public links</p>
                <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">Live URL:</span>
                    <a href={`/portfolio/${portfolioSlug}`} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      /portfolio/{portfolioSlug} <FaExternalLinkAlt className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">Copy the public link and share it with your audience.</div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Portfolio sections</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Drag and drop sections to control the order.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => addSection('text')} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                  <FaPlus className="w-4 h-4" /> Add text
                </button>
                <button type="button" onClick={() => addSection('feature')} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                  <FaPlus className="w-4 h-4" /> Add feature
                </button>
              </div>
            </div>

            {draft.sections.length === 0 ? (
              <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-center text-sm text-slate-500 dark:bg-slate-950/70 dark:text-slate-400">
                No sections yet. Add a new section to start building your portfolio.
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={draft.sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
                  <div className="mt-6 space-y-4">
                    {draft.sections.map((section) => (
                      <SortableSectionItem
                        key={section.id}
                        section={section}
                        onRemove={() => removeSection(section.id)}
                        onChange={(patch) => updateSection(section.id, patch)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Live preview</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">See how your portfolio will look as you edit it.</p>
            <div className="mt-6">
              <PortfolioPreview portfolio={draft} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
            <AIPanel
              draftTitle={draft.title}
              draftHeroTitle={draft.heroTitle}
              draftHeroSubtitle={draft.heroSubtitle}
              draftDescription={draft.description}
              draftSections={draft.sections}
              applyAbout={(text) => {
                // Insert generated about into first text section or create one
                const firstText = draft.sections.find((s) => s.type === 'text');
                if (firstText) {
                  updateSection(firstText.id, { body: text });
                } else {
                  addSection('text');
                  // small delay to allow new section; then update latest
                  setTimeout(() => {
                    const latest = draft.sections[draft.sections.length - 1];
                    if (latest) updateSection(latest.id, { body: text });
                  }, 120);
                }
              }}
              applyResumeSummary={(summary) => {
                // Apply summary to heroTitle if it fits
                updateDraft({ heroSubtitle: summary });
              }}
            />
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Version history</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">{versions.length}</span>
            </div>
            <div className="mt-4 space-y-3">
              {versions.length === 0 ? (
                <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-950/70 dark:text-slate-400">No saved versions yet. Use the save button to snapshot your portfolio.</div>
              ) : (
                versions.map((version) => (
                  <div key={version.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{version.note || 'Saved version'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(version.createdAt).toLocaleString()}</p>
                      </div>
                      <button type="button" onClick={() => restoreVersion(version.snapshot)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                        Restore
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
