import { prisma } from './db';

export async function getSettings(keys?: string[]): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany(
    keys ? { where: { key: { in: keys } } } : undefined
  );
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
}
