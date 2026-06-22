import { NextRequest, NextResponse } from 'next/server';
import { checkOrigin } from './security';

/**
 * Admin route guard. Authentication is enforced by middleware.ts (JWT cookie);
 * this adds CSRF origin validation for mutating requests.
 */
export function guardMutation(req: NextRequest): NextResponse | null {
  if (!checkOrigin(req)) {
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }
  return null;
}

export async function readJson(req: NextRequest): Promise<any | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export function ok(data: unknown = { ok: true }, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/** Picks only the allowed keys from a payload (mass-assignment protection). */
export function pick<T extends Record<string, any>>(body: any, keys: string[]): Partial<T> {
  const out: Record<string, any> = {};
  for (const k of keys) {
    if (body && body[k] !== undefined) out[k] = body[k];
  }
  return out as Partial<T>;
}
