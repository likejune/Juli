/**
 * Idempotent database seed — safe to run repeatedly.
 * Creates the admin user, demo gallery, blog, biography, SEO and social links
 * only when they do not exist yet (never overwrites admin edits).
 */
import { readFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Minimal .env loader (no dependency on dotenv) — Prisma Client needs DATABASE_URL.
try {
  for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"#]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
} catch {
  /* .env may not exist on Vercel — env vars come from the dashboard */
}
import { CATEGORIES, ARTWORKS } from './data/artworks.mjs';
import { POSTS } from './data/posts.mjs';
import { BIOGRAPHY, ABOUT_PHOTO, HERO_QUOTES } from './data/biography.mjs';

const prisma = new PrismaClient();

const INITIAL_ADMIN_EMAIL = 'admin@juliabunyakova.com';
const INITIAL_ADMIN_PASSWORD = '33512228'; // hashed below; admin must change it after first login

async function seedUsers() {
  const count = await prisma.user.count();
  if (count > 0) return;
  await prisma.user.create({
    data: {
      email: INITIAL_ADMIN_EMAIL,
      name: 'Administrator',
      passwordHash: await bcrypt.hash(INITIAL_ADMIN_PASSWORD, 12),
      role: 'admin',
      mustChangePassword: true,
    },
  });
  console.log(`[seed] Admin user created (${INITIAL_ADMIN_EMAIL})`);
}

async function seedGallery() {
  if ((await prisma.artwork.count()) > 0) return;
  const catIds = {};
  for (const c of CATEGORIES) {
    const cat = await prisma.artworkCategory.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    catIds[c.slug] = cat.id;
  }
  let order = 0;
  for (const a of ARTWORKS) {
    const { category, ...rest } = a;
    await prisma.artwork.create({
      data: { ...rest, categoryId: catIds[category] ?? null, sortOrder: order++ },
    });
  }
  console.log(`[seed] ${ARTWORKS.length} artworks in ${CATEGORIES.length} categories`);
}

async function seedBlog() {
  if ((await prisma.blogPost.count()) > 0) return;
  for (const post of POSTS) {
    const { publishedAt, ...rest } = post;
    await prisma.blogPost.create({
      data: { ...rest, publishedAt: new Date(publishedAt), status: 'published' },
    });
  }
  console.log(`[seed] ${POSTS.length} blog posts`);
}

async function seedBiography() {
  if ((await prisma.biographyEntry.count()) > 0) return;
  await prisma.biographyEntry.createMany({ data: BIOGRAPHY });
  console.log(`[seed] ${BIOGRAPHY.length} biography entries`);
}

async function seedSettings() {
  const defaults = {
    ...HERO_QUOTES,
    about_photo_url: ABOUT_PHOTO.url,
    about_photo_caption_ru: ABOUT_PHOTO.captionRu,
    about_photo_caption_en: ABOUT_PHOTO.captionEn,
    about_photo_caption_zh: ABOUT_PHOTO.captionZh,
    contact_email: 'studio@juliabunyakova.com',
    default_locale: 'ru',
  };
  for (const [key, value] of Object.entries(defaults)) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });
  }
  console.log('[seed] site settings');
}

async function seedSocial() {
  if ((await prisma.socialLink.count()) > 0) return;
  const links = [
    { platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/julia.bunyakova.art', sortOrder: 1 },
    { platform: 'facebook', label: 'Facebook', url: 'https://facebook.com/julia.bunyakova.art', sortOrder: 2 },
    { platform: 'vk', label: 'VK', url: 'https://vk.com/julia_bunyakova_art', sortOrder: 3 },
    { platform: 'youtube', label: 'YouTube', url: 'https://youtube.com/@julia.bunyakova', sortOrder: 4 },
    { platform: 'telegram', label: 'Telegram', url: 'https://t.me/julia_bunyakova_art', sortOrder: 5 },
    { platform: 'tiktok', label: 'TikTok', url: 'https://tiktok.com/@julia.bunyakova', sortOrder: 6, active: false },
    { platform: 'wechat', label: 'WeChat', url: 'https://weixin.qq.com/', sortOrder: 7, active: false },
    { platform: 'xiaohongshu', label: '小红书', url: 'https://xiaohongshu.com/', sortOrder: 8, active: false },
  ];
  await prisma.socialLink.createMany({ data: links });
  console.log(`[seed] ${links.length} social links`);
}

async function seedSeo() {
  const pages = {
    home: {
      ru: ['Julia Bunyakova — современная художница | Официальный сайт', 'Официальный сайт художницы Julia Bunyakova. Живопись, персональные выставки, галерея работ, блог о современном искусстве.', 'живопись, современное искусство, художница, картины, купить картину'],
      en: ['Julia Bunyakova — Contemporary Artist | Official Website', 'Official website of artist Julia Bunyakova. Paintings, solo exhibitions, gallery of works, journal on contemporary art.', 'painting, contemporary art, artist, buy art'],
      zh: ['Julia Bunyakova — 当代艺术家官方网站', '艺术家Julia Bunyakova官方网站。绘画作品、个展、画廊及当代艺术博客。', '绘画, 当代艺术, 艺术家, 购买艺术品'],
    },
    gallery: {
      ru: ['Галерея работ — Julia Bunyakova', 'Галерея живописи Julia Bunyakova: серии «Тихий свет», «Вода помнит», «Берега» и ранние работы.', 'галерея, картины, живопись маслом'],
      en: ['Gallery — Julia Bunyakova', 'Gallery of paintings by Julia Bunyakova: the series "Quiet Light", "Water Remembers", "Shores" and early works.', 'gallery, paintings, oil painting'],
      zh: ['画廊 — Julia Bunyakova', 'Julia Bunyakova绘画作品画廊：《静光》《水的记忆》《海岸》系列及早期作品。', '画廊, 油画, 绘画作品'],
    },
    about: {
      ru: ['О художнице — Julia Bunyakova', 'Биография, творческий путь, философия искусства, выставки и достижения художницы Julia Bunyakova.', 'биография художницы, выставки'],
      en: ['About the Artist — Julia Bunyakova', 'Biography, creative path, philosophy of art, exhibitions and achievements of artist Julia Bunyakova.', 'artist biography, exhibitions'],
      zh: ['关于艺术家 — Julia Bunyakova', '艺术家Julia Bunyakova的简历、艺术历程、艺术哲学、展览与成就。', '艺术家简历, 展览'],
    },
    blog: {
      ru: ['Блог — Julia Bunyakova', 'Блог художницы Julia Bunyakova: заметки о живописи, выставках и закулисье мастерской.', 'блог художника, статьи об искусстве'],
      en: ['Journal — Julia Bunyakova', 'Journal of artist Julia Bunyakova: notes on painting, exhibitions and life behind the studio door.', 'artist journal, art essays'],
      zh: ['博客 — Julia Bunyakova', '艺术家Julia Bunyakova的博客：关于绘画、展览与画室幕后的随笔。', '艺术家博客, 艺术随笔'],
    },
    contacts: {
      ru: ['Контакты — Julia Bunyakova', 'Связаться с художницей Julia Bunyakova: приобретение работ, выставки, сотрудничество, пресса.', 'контакты, купить картину'],
      en: ['Contact — Julia Bunyakova', 'Contact artist Julia Bunyakova: acquisitions, exhibitions, collaborations, press.', 'contact, buy painting'],
      zh: ['联系方式 — Julia Bunyakova', '联系艺术家Julia Bunyakova：作品购藏、展览、合作与媒体事宜。', '联系方式, 购买绘画'],
    },
  };
  for (const [page, locales] of Object.entries(pages)) {
    for (const [locale, [metaTitle, metaDescription, keywords]] of Object.entries(locales)) {
      await prisma.seoSetting.upsert({
        where: { page_locale: { page, locale } },
        update: {},
        create: {
          page, locale, metaTitle, metaDescription, keywords,
          ogTitle: metaTitle, ogDescription: metaDescription,
          ogImage: 'https://www.artic.edu/iiif/2/8534685d-1102-e1e3-e194-94f6e925e8b0/full/1200,/0/default.jpg',
        },
      });
    }
  }
  console.log('[seed] SEO settings for 5 pages × 3 locales');
}

async function main() {
  await seedUsers();
  await seedGallery();
  await seedBlog();
  await seedBiography();
  await seedSettings();
  await seedSocial();
  await seedSeo();
  console.log('[seed] Done.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
