import { v2 as cloudinary } from 'cloudinary';

/**
 * Cloudinary upload helpers. When CLOUDINARY_* env vars are missing, the app
 * runs in a local mock/sandbox mode: uploads return a data/binary URL instead
 * of hitting Cloudinary, so the flow can be tested end-to-end without
 * credentials. This mirrors the existing AI / Razorpay mock-mode pattern.
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && API_KEY && API_SECRET);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
  });
}

export type UploadResult = {
  url: string;
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
  mock?: boolean;
};

/**
 * Uploads a file buffer to Cloudinary.
 * In mock mode, falls back to a data URL so uploads still work offline.
 */
export async function uploadBuffer(
  buffer: Buffer,
  options: {
    folder?: string;
    filename?: string;
    resourceType?: 'image' | 'raw' | 'video';
    mimeType?: string;
  } = {}
): Promise<UploadResult> {
  const { folder = 'portfolios', filename = 'upload', resourceType = 'image', mimeType = 'image/png' } = options;

  if (!isCloudinaryConfigured) {
    // Mock mode: return a data URL so the UI can display the upload.
    const base64 = buffer.toString('base64');
    return {
      url: `data:${mimeType};base64,${base64}`,
      secureUrl: `data:${mimeType};base64,${base64}`,
      publicId: `mock_${Date.now()}`,
      mock: true
    };
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename ? `${folder}/${filename}-${Date.now()}` : undefined,
        resource_type: resourceType
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
          return;
        }
        resolve({
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format
        });
      }
    );
    stream.end(buffer);
  });
}

/**
 * Generates a Cloudinary URL with transform params (e.g. resize, crop).
 * Returns the original URL unchanged in mock mode.
 */
export function transformCloudinaryUrl(
  url: string,
  options: { width?: number; height?: number; crop?: 'fill' | 'scale' | 'crop' } = {}
): string {
  if (!url || url.startsWith('data:') || !url.includes('cloudinary.com')) return url;
  const { width, height, crop = 'fill' } = options;
  const transforms: string[] = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  if (transforms.length === 0) return url;

  // Insert transforms after the upload path segment "image/upload/".
  const marker = '/image/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const insertAt = idx + marker.length;
  return `${url.slice(0, insertAt)}${transforms.join(',')}/${url.slice(insertAt)}`;
}
