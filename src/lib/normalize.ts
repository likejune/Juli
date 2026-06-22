import { sanitizeText } from './security';
import { pick } from './admin-api';

const ARTWORK_FIELDS = [
  'slug', 'imageUrl', 'titleRu', 'titleEn', 'titleZh',
  'descriptionRu', 'descriptionEn', 'descriptionZh',
  'techniqueRu', 'techniqueEn', 'techniqueZh',
  'year', 'widthCm', 'heightCm', 'categoryId', 'published', 'sortOrder',
  'seoTitleRu', 'seoTitleEn', 'seoTitleZh', 'seoDescRu', 'seoDescEn', 'seoDescZh',
];

export function normalizeArtwork(body: any) {
  const data: any = pick(body, ARTWORK_FIELDS);
  for (const key of Object.keys(data)) {
    if (typeof data[key] === 'string' && key !== 'imageUrl') data[key] = sanitizeText(data[key], 4000);
  }
  if (data.year !== undefined) data.year = Math.round(Number(data.year)) || new Date().getFullYear();
  if (data.widthCm !== undefined) data.widthCm = data.widthCm === null || data.widthCm === '' ? null : Number(data.widthCm) || null;
  if (data.heightCm !== undefined) data.heightCm = data.heightCm === null || data.heightCm === '' ? null : Number(data.heightCm) || null;
  if (data.sortOrder !== undefined) data.sortOrder = Math.round(Number(data.sortOrder)) || 0;
  if (data.published !== undefined) data.published = Boolean(data.published);
  if (data.categoryId !== undefined && !data.categoryId) data.categoryId = null;
  return data;
}

const POST_FIELDS = [
  'slug', 'imageUrl', 'titleRu', 'titleEn', 'titleZh',
  'excerptRu', 'excerptEn', 'excerptZh',
  'bodyRu', 'bodyEn', 'bodyZh',
  'categoryRu', 'categoryEn', 'categoryZh',
  'status', 'publishedAt',
  'seoTitleRu', 'seoTitleEn', 'seoTitleZh', 'seoDescRu', 'seoDescEn', 'seoDescZh',
];

export function normalizePost(body: any) {
  const data: any = pick(body, POST_FIELDS);
  for (const key of Object.keys(data)) {
    if (typeof data[key] === 'string' && !['imageUrl', 'publishedAt'].includes(key)) {
      data[key] = sanitizeText(data[key], 50_000);
    }
  }
  if (data.status !== undefined && !['draft', 'published'].includes(data.status)) data.status = 'draft';
  if (data.publishedAt !== undefined) {
    const d = new Date(data.publishedAt);
    data.publishedAt = isNaN(d.getTime()) ? new Date() : d;
  }
  return data;
}
