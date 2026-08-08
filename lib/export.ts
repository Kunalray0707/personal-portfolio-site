import type { Portfolio } from '@prisma/client';

export type ExportSection = {
  id: string;
  type: 'text' | 'feature' | 'contact';
  title: string;
  body?: string;
  bullets?: string[];
  imageUrl?: string;
};

export type ExportPortfolio = {
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  slug: string;
  sections: ExportSection[];
};

/**
 * Escape a string for safe insertion into an HTML document.
 * Handles &, <, >, and " to prevent broken markup / XSS.
 */
function escapeHTML(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Normalize a raw Prisma portfolio row into a lightweight export shape.
 * This keeps the exported payload free of sensitive/internal fields.
 */
export function toExportPortfolio(portfolio: Portfolio): ExportPortfolio {
  const content = (portfolio.content ?? {}) as {
    sections?: ExportSection[];
  };
  return {
    title: portfolio.title,
    description: portfolio.description ?? '',
    heroTitle: portfolio.heroTitle,
    heroSubtitle: portfolio.heroSubtitle ?? '',
    slug: portfolio.slug,
    sections: Array.isArray(content.sections) ? content.sections : []
  };
}

/**
 * Build a standalone, self-contained HTML document from a portfolio.
 * The returned string includes inline CSS so it can be opened directly
 * in a browser or saved/printed as a PDF.
 */
export function buildStandaloneHTML(portfolio: ExportPortfolio): string {
  const escape = escapeHTML;

  const sectionsHtml = portfolio.sections
    .map((section) => {
      const bullets = Array.isArray(section.bullets) && section.bullets.length > 0
        ? `<ul class="bullets">${section.bullets.map((b) => `<li>${escape(b)}</li>`).join('')}</ul>`
        : `<p>${escape(section.body || '')}</p>`;

      return `
        <section class="card">
          <p class="eyebrow">${escape(section.type)}</p>
          <h2>${escape(section.title)}</h2>
          ${bullets}
        </section>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escape(portfolio.title)}</title>
  <meta name="description" content="${escape(portfolio.description)}" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #f5f3ff 0%, #eef2ff 100%);
      color: #0f172a;
      line-height: 1.6;
      padding: 40px 20px;
    }
    .container { max-width: 820px; margin: 0 auto; }
    .hero {
      background: #0f172a;
      color: #fff;
      border-radius: 24px;
      padding: 48px;
      margin-bottom: 32px;
    }
    .hero .eyebrow { color: #a5b4fc; text-transform: uppercase; letter-spacing: 0.2em; font-size: 13px; }
    .hero h1 { font-size: 40px; margin: 16px 0 12px; font-weight: 800; }
    .hero p { color: #e2e8f0; font-size: 18px; max-width: 560px; }
    .card {
      background: rgba(255,255,255,0.9);
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 28px;
      margin-bottom: 20px;
    }
    .card .eyebrow { text-transform: uppercase; letter-spacing: 0.2em; font-size: 12px; color: #6366f1; }
    .card h2 { font-size: 24px; margin: 8px 0 12px; }
    .card p { color: #334155; }
    .bullets { list-style: none; margin-top: 8px; }
    .bullets li { display: flex; gap: 10px; align-items: flex-start; padding: 6px 0; color: #334155; }
    .bullets li::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #6366f1; margin-top: 8px; flex-shrink: 0; }
    @media print {
      body { background: #fff; padding: 0; }
      .hero, .card { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="hero">
      <p class="eyebrow">Portfolio</p>
      <h1>${escape(portfolio.heroTitle)}</h1>
      <p>${escape(portfolio.heroSubtitle)}</p>
    </header>
    ${sectionsHtml}
    <footer style="text-align:center;color:#64748b;font-size:13px;padding:24px 0;">
      Generated with Portfolio AI Pro
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Return a JSON payload (string) describing the portfolio.
 */
export function buildJSONExport(portfolio: ExportPortfolio): string {
  return JSON.stringify(
    {
      app: 'Portfolio AI Pro',
      version: 1,
      exportedAt: new Date().toISOString(),
      portfolio
    },
    null,
    2
  );
}

/**
 * Build a vercel.json manifest for deploying a portfolio as a static site.
 */
export function buildVercelManifest(portfolio: ExportPortfolio): Record<string, unknown> {
  return {
    name: `portfolio-${portfolio.slug}`,
    version: 2,
    framework: null,
    buildCommand: null,
    outputDirectory: '.',
    github: {
      enabled: true,
      silent: true
    }
  };
}

/**
 * Build mock GitHub repository metadata for a portfolio export.
 */
export function buildGitHubMetadata(portfolio: ExportPortfolio): Record<string, string> {
  const repoName = `portfolio-${portfolio.slug}`;
  return {
    repoName,
    description: portfolio.description || 'A portfolio generated with Portfolio AI Pro',
    homepage: `/portfolio/${portfolio.slug}`,
    private: 'false'
  };
}
