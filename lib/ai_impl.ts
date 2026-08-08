const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export interface Section {
  id?: string;
  type?: 'text' | 'feature' | 'contact';
  title?: string;
  body?: string;
  bullets?: string[];
  imageUrl?: string;
}

async function callOpenAI(systemPrompt: string, userPrompt: string) {
  // If no API key is configured, use a deterministic mock response to allow local development.
  if (!OPENAI_API_KEY) {
    return mockOpenAI(systemPrompt, userPrompt);
  }

  const body = {
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 800
  };

  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${text}`);
  }

  const json = await res.json();
  const reply = json?.choices?.[0]?.message?.content ?? json?.choices?.[0]?.text ?? '';
  return (reply as string).trim();
}

function mockOpenAI(systemPrompt: string, userPrompt: string) {
  // Simple deterministic mock responses based on intent heuristics.
  const sp = systemPrompt.toLowerCase();
  const up = userPrompt.toLowerCase();

  // Skills extraction -> return JSON
  if (sp.includes('skills extraction') || up.includes('return a json object') && up.includes('primary')) {
    return Promise.resolve(JSON.stringify({ primary: ['JavaScript', 'TypeScript', 'React'], secondary: ['Node.js', 'Tailwind CSS'] }));
  }

  // SEO -> return title, description and keywords
  if (sp.includes('seo assistant') || up.includes('seo')) {
    const title = (up.match(/title: (.+)\\n/) || [])[1] || 'Portfolio Title';
    return Promise.resolve(`${title} | Professional Portfolio\nA concise description for the portfolio.\nKeywords: portfolio, developer, designer, projects, resume`);
  }

  // Theme suggestion -> return JSON
  if (sp.includes('creative ui assistant') || up.includes('suggest a theme')) {
    return Promise.resolve(JSON.stringify({ theme: 'light', colors: ['#0ea5a4', '#6366f1', '#f472b6'] }));
  }

  // Resume analyzer -> return JSON
  if (sp.includes('resume analyzer') || up.includes('analyze this resume')) {
    return Promise.resolve(JSON.stringify({ strengths: ['Clear project outcomes', 'Strong technical skills'], weaknesses: ['Missing measurable metrics'], missingKeywords: ['AWS', 'Kubernetes'], suggestions: 'Add quantified outcomes and modern stack keywords.' }));
  }

  // Default textual responses for generators
  if (sp.includes('writes concise and persuasive') || up.includes('create a short')) {
    return Promise.resolve('Experienced software engineer building production-grade web applications. Passionate about clean architecture and delivering business value through thoughtful design and engineering. Open to freelance and full-time opportunities.');
  }

  if (sp.includes('resume writer') || up.includes('create a concise resume summary')) {
    return Promise.resolve('Full-stack engineer with 6+ years building scalable web applications, specializing in TypeScript, React, and cloud-native systems. Proven track record delivering customer-facing features that increase engagement.');
  }

  if (sp.includes('product copywriter') || up.includes('suggest 3 short project')) {
    return Promise.resolve('Project A - Improved performance by 40%\nProject B - Led a redesign increasing conversions\nProject C - Built an analytics pipeline for product insights');
  }

  // Fallback
  return Promise.resolve('Mock response: OpenAI API key not configured. Set OPENAI_API_KEY to enable real AI responses.');
}

export async function generateAbout({ title, heroTitle, heroSubtitle, description, sections }: { title: string; heroTitle?: string; heroSubtitle?: string; description?: string; sections?: Section[]; }) {
  const system = "You are a helpful assistant that writes concise and persuasive portfolio About sections for professionals. Keep language professional, clear, and tailored to the provided context.";
  const user = `Create a short (3-5 sentence) About section suitable for a portfolio with the following details. Title: ${title}\nHero title: ${heroTitle || ''}\nHero subtitle: ${heroSubtitle || ''}\nDescription: ${description || ''}\nExisting sections: ${JSON.stringify(sections || [])}\n\nTone: professional, confident, approachable. Include 1-2 sentences about skills/experience and 1 sentence about what the creator offers to clients/employers.`;
  const text = await callOpenAI(system, user);
  return text;
}

export async function generateResumeSummary({ resumeText }: { resumeText: string }) {
  const system = "You are an expert resume writer that summarizes a candidate's experience into a 2-3 sentence summary for a portfolio hero section.";
  const user = `Given the resume text below, create a concise resume summary (2-3 sentences) suitable for a portfolio hero. Resume:\n\n${resumeText}`;
  const text = await callOpenAI(system, user);
  return text;
}

export async function generateProjectIdeas({ context }: { context: string }) {
  const system = "You are a product copywriter that generates project description drafts and bullets for portfolio case studies.";
  const user = `Based on the following context, suggest 3 short project case study titles and for each provide a 2-sentence description and 3 quick bullet highlights. Context: ${context}`;
  const text = await callOpenAI(system, user);
  return text;
}

export async function generateBlogDraft({ topic, audience }: { topic: string; audience?: string; }) {
  const system = "You are a helpful blog writer producing a concise blog draft suitable for portfolio blogs. Include headings and a short intro, 3 sections, and a conclusion.";
  const user = `Write a short blog draft about "${topic}" aimed at ${audience || 'professionals'}. Keep it approximately 400-600 words with subheadings.`;
  const text = await callOpenAI(system, user);
  return text;
}

export async function suggestSkills({ projectsOrBio }: { projectsOrBio: string }): Promise<{ primary?: string[]; secondary?: string[] } | { raw: string }> {
  const system = "You are a skills extraction assistant. Analyze the input and return a JSON object with primary and secondary skills.";
  const user = `Analyze the following content and return a JSON object: { "primary": [..], "secondary": [..] } listing the most relevant skills. Content: ${projectsOrBio}`;
  const text = await callOpenAI(system, user);
  try {
    const parsed = JSON.parse(text) as { primary?: string[]; secondary?: string[] };
    return parsed;
  } catch (e) {
    return { raw: text };
  }
}

export async function suggestSEO({ title, description }: { title: string; description?: string; }) {
  const system = "You are an SEO assistant. Produce meta title (<=60 chars), meta description (<=160 chars), and a list of 5 SEO keywords.";
  const user = `Provide SEO meta and keywords for the following portfolio: Title: ${title}\nDescription: ${description || ''}`;
  const text = await callOpenAI(system, user);
  return text;
}

export async function suggestThemeAndColors({ content }: { content: string }): Promise<{ theme?: string; colors?: string[] } | { raw: string }> {
  const system = "You are a creative UI assistant that suggests a theme (dark|light) and a 3-color palette in hex format based on content and audience.";
  const user = `Based on this portfolio content: ${content}, suggest a theme ("dark" or "light") and return a JSON: { "theme": "dark", "colors": ["#...","#...","#..."] }`;
  const text = await callOpenAI(system, user);
  try {
    return JSON.parse(text) as { theme?: string; colors?: string[] };
  } catch (err) {
    return { raw: text };
  }
}

export async function scanResume({ resumeText }: { resumeText: string }): Promise<{ strengths?: string[]; weaknesses?: string[]; missingKeywords?: string[]; suggestions?: string } | { raw: string }> {
  const system = "You are a resume analyzer that returns an object with strengths, weaknesses, missing keywords, and suggested improvements.";
  const user = `Analyze this resume and return JSON: { strengths: [...], weaknesses: [...], missingKeywords: [...], suggestions: "..." }\n\nResume:\n${resumeText}`;
  const text = await callOpenAI(system, user);
  try {
    return JSON.parse(text) as { strengths?: string[]; weaknesses?: string[]; missingKeywords?: string[]; suggestions?: string };
  } catch (err) {
    return { raw: text };
  }
}
