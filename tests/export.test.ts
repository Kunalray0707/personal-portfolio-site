    import { describe, it, expect } from 'vitest';
import {
  toExportPortfolio,
  buildStandaloneHTML,
  buildJSONExport,
  buildVercelManifest,
  buildGitHubMetadata,
  type ExportPortfolio,
} from '../lib/export';
import {
  normalizeDomain,
  isValidDomain,
  generateVerificationToken,
  verifyDomainToken,
} from '../lib/domains';

function makeExportPortfolio(overrides: Partial<ExportPortfolio> = {}): ExportPortfolio {
  return {
    title: 'Jane Doe',
    description: 'Designer and developer.',
    heroTitle: 'Crafting thoughtful digital experiences.',
    heroSubtitle: 'Product designer & frontend engineer.',
    slug: 'jane-doe',
    sections: [
      { id: 's1', type: 'text', title: 'About', body: 'I build accessible products.' },
      { id: 's2', type: 'feature', title: 'Projects', bullets: ['Project A', 'Project B'] },
      { id: 's3', type: 'contact', title: 'Contact', body: 'Reach out anytime.' },
    ],
    ...overrides,
  };
}

describe('Export lib', () => {
  it('toExportPortfolio normalizes a raw portfolio-ish object', () => {
    const raw = {
      title: 'T',
      description: 'D',
      heroTitle: 'H',
      heroSubtitle: 'S',
      slug: 't-slug',
      content: { sections: [{ id: 'x', type: 'text', title: 'X' }] },
    } as unknown as Parameters<typeof toExportPortfolio>[0];
    const out = toExportPortfolio(raw);
    expect(out.title).toBe('T');
    expect(out.slug).toBe('t-slug');
    expect(out.sections).toHaveLength(1);
  });

  it('toExportPortfolio handles missing content gracefully', () => {
    const raw = {
      title: 'T',
      description: null,
      heroTitle: 'H',
      heroSubtitle: null,
      slug: 't',
      content: '{}',
    } as Parameters<typeof toExportPortfolio>[0];
    const out = toExportPortfolio(raw);
    expect(out.description).toBe('');
    expect(out.heroSubtitle).toBe('');
    expect(out.sections).toEqual([]);
  });

  it('buildStandaloneHTML returns a complete HTML document', () => {
    const html = buildStandaloneHTML(makeExportPortfolio());
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Jane Doe');
    expect(html).toContain('Crafting thoughtful digital experiences.');
    expect(html).toContain('Project A');
    expect(html).toContain('</html>');
  });

  it('buildStandaloneHTML escapes HTML-sensitive characters', () => {
    const portfolio = makeExportPortfolio({
      title: 'A & B <script>alert("x")</script>',
      sections: [{ id: 's', type: 'text', title: '<b>Title</b>', body: 'text & more' }],
    });
    const html = buildStandaloneHTML(portfolio);
    expect(html).not.toContain('<script>alert');
    expect(html).toContain('&amp;');
  });

  it('buildJSONExport returns valid JSON with metadata', () => {
    const json = buildJSONExport(makeExportPortfolio());
    const parsed = JSON.parse(json) as { app: string; version: number; portfolio: ExportPortfolio };
    expect(parsed.app).toBe('Portfolio AI Pro');
    expect(parsed.version).toBe(1);
    expect(parsed.portfolio.slug).toBe('jane-doe');
  });

  it('buildVercelManifest returns a vercel.json-shaped object', () => {
    const manifest = buildVercelManifest(makeExportPortfolio());
    expect(manifest.version).toBe(2);
    expect(manifest.name).toBe('portfolio-jane-doe');
    expect(manifest.framework).toBeNull();
  });

  it('buildGitHubMetadata returns a repo name derived from the slug', () => {
    const meta = buildGitHubMetadata(makeExportPortfolio());
    expect(meta.repoName).toBe('portfolio-jane-doe');
    expect(meta.private).toBe('false');
    expect(meta.description).toBeTruthy();
  });
});

describe('Domains lib', () => {
  it('normalizeDomain strips protocol, path and www prefix', () => {
    expect(normalizeDomain('https://www.Example.com/some/path')).toBe('example.com');
    expect(normalizeDomain('  PORTFOLIO.IO  ')).toBe('portfolio.io');
    expect(normalizeDomain('sub.domain.dev')).toBe('sub.domain.dev');
  });

  it('isValidDomain accepts root and subdomains', () => {
    expect(isValidDomain('example.com')).toBe(true);
    expect(isValidDomain('www.example.com')).toBe(true);
    expect(isValidDomain('sub.domain.dev')).toBe(true);
  });

it('isValidDomain rejects invalid inputs', () => {
    expect(isValidDomain('not a domain')).toBe(false);
    expect(isValidDomain('example')).toBe(false);
    expect(isValidDomain('')).toBe(false);
    // A scheme-prefixed value is normalized (scheme stripped) and still a valid domain
    expect(isValidDomain('https://example.com')).toBe(true);
  });

  it('generateVerificationToken returns a paip- prefixed token', () => {
    const token = generateVerificationToken();
    expect(token).toMatch(/^paip-/);
    expect(token.length).toBeGreaterThan(5);
  });

  it('verifyDomainToken returns true when tokens match', () => {
    expect(verifyDomainToken('example.com', 'abc', 'abc')).toBe(true);
  });

  it('verifyDomainToken returns false when tokens differ or expected is empty', () => {
    expect(verifyDomainToken('example.com', 'abc', 'xyz')).toBe(false);
    expect(verifyDomainToken('example.com', 'abc', '')).toBe(false);
    expect(verifyDomainToken('example.com', '', '')).toBe(false);
  });
});
