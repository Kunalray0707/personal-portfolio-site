import { describe, it, expect } from 'vitest';

import { POST as aboutPOST } from '../app/api/ai/about/route';
import { POST as resumeSummaryPOST } from '../app/api/ai/resume-summary/route';
import { POST as skillsPOST } from '../app/api/ai/skills/route';
import { POST as themePOST } from '../app/api/ai/theme/route';
import { POST as resumeScanPOST } from '../app/api/ai/resume-scan/route';

// Helper to mock a Next.js Request object with only .json()
function mockReq(body: unknown) {
  return {
    json: async () => body,
  } as unknown as Request;
}

describe('AI API route handlers (integration, mock mode)', () => {
  it('POST /api/ai/about returns generated about text', async () => {
    const req = mockReq({ title: 'Jane Doe', heroTitle: 'Designer', heroSubtitle: 'UI/UX', description: 'Experienced designer', sections: [] });
    const res = await aboutPOST(req);
    const body = await (res as Response).json();
    expect(body).toBeDefined();
    expect(body.about).toBeTruthy();
    expect(typeof body.about).toBe('string');
  });

  it('POST /api/ai/resume-summary returns a summary', async () => {
    const req = mockReq({ resumeText: 'Worked on many web projects and frameworks' });
    const res = await resumeSummaryPOST(req);
    const body = await (res as Response).json();
    expect(body).toBeDefined();
    expect(body.summary).toBeTruthy();
  });

  it('POST /api/ai/skills returns parsed skills (or raw)', async () => {
    const req = mockReq({ projectsOrBio: 'Built React apps and Node APIs' });
    const res = await skillsPOST(req);
    const body = await (res as Response).json();
    expect(body).toBeDefined();
    expect(body.skills).toBeDefined();
  });

  it('POST /api/ai/theme returns theme suggestion', async () => {
    const req = mockReq({ content: 'A modern SaaS for developers' });
    const res = await themePOST(req);
    const body = await (res as Response).json();
    expect(body).toBeDefined();
    expect(body.theme).toBeDefined();
  });

  it('POST /api/ai/resume-scan returns analysis', async () => {
    const req = mockReq({ resumeText: 'Experienced developer focusing on React and Node' });
    const res = await resumeScanPOST(req);
    const body = await (res as Response).json();
    expect(body).toBeDefined();
    expect(body.result).toBeDefined();
  });

  // Negative tests: invalid payloads should return error responses
  it('POST /api/ai/about with missing title returns error', async () => {
    const req = mockReq({ heroTitle: 'X' });
    const res = await aboutPOST(req);
    // response should include an error
    const body = await (res as Response).json();
    expect((res as Response).status).not.toBe(200);
    expect(body.error).toBeTruthy();
  });

  it('POST /api/ai/skills with too short projectsOrBio returns error', async () => {
    const req = mockReq({ projectsOrBio: 'short' });
    const res = await skillsPOST(req);
    const body = await (res as Response).json();
    expect((res as Response).status).not.toBe(200);
    expect(body.error).toBeTruthy();
  });

  it('POST /api/ai/resume-summary with missing resumeText returns error', async () => {
    const req = mockReq({});
    const res = await resumeSummaryPOST(req);
    const body = await (res as Response).json();
    expect((res as Response).status).not.toBe(200);
    expect(body.error).toBeTruthy();
  });

  it('POST /api/ai/theme with empty content returns error', async () => {
    const req = mockReq({ content: '' });
    const res = await themePOST(req);
    const body = await (res as Response).json();
    expect((res as Response).status).not.toBe(200);
    expect(body.error).toBeTruthy();
  });

});
