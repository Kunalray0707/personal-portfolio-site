import { describe, it, expect } from 'vitest';
import { generateAbout, suggestSkills, suggestThemeAndColors, scanResume, generateResumeSummary } from '../lib/ai_impl';

describe('AI helpers (mock mode)', () => {
  it('generateAbout returns a non-empty string', async () => {
    const text = await generateAbout({ title: 'John Doe', heroTitle: 'Engineer', heroSubtitle: 'Full-stack', description: 'Experienced dev', sections: [] });
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(0);
  });

  it('generateResumeSummary returns a non-empty string', async () => {
    const summary = await generateResumeSummary({ resumeText: 'Worked on many projects' });
    expect(typeof summary).toBe('string');
    expect(summary.length).toBeGreaterThan(0);
  });

  it('suggestSkills returns parsed primary/secondary when possible', async () => {
    const skills = await suggestSkills({ projectsOrBio: 'Built React apps and Node APIs' });
    // Either parsed object or raw string
    expect(skills).toBeDefined();
    if ('primary' in (skills as any)) {
      expect(Array.isArray((skills as any).primary)).toBe(true);
    }
  });

  it('suggestThemeAndColors returns theme and colors or raw', async () => {
    const theme = await suggestThemeAndColors({ content: 'Modern SaaS product for developers' });
    expect(theme).toBeDefined();
    if ('theme' in (theme as any)) {
      expect((theme as any).colors).toBeDefined();
    }
  });

  it('scanResume returns strengths/weaknesses or raw', async () => {
    const res = await scanResume({ resumeText: 'Experienced developer focusing on React and Node' });
    expect(res).toBeDefined();
    if ('strengths' in (res as any)) {
      expect(Array.isArray((res as any).strengths)).toBe(true);
    }
  });
});
