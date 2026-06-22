'use client';

/** Small shared building blocks for the admin panel (client side). */

export async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export function PageHead({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-serif text-3xl text-white">{title}</h1>
        {subtitle && <p className="text-sm text-mist mt-1.5">{subtitle}</p>}
      </div>
      {children && <div className="flex gap-3">{children}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, accent }: { label: string; value: string | number; hint?: string; accent?: boolean }) {
  return (
    <div className="adm-card p-5">
      <p className="text-[11px] uppercase tracking-widest2 text-mist">{label}</p>
      <p className={`font-serif text-3xl mt-2 ${accent ? 'text-gold' : 'text-white'}`}>{value}</p>
      {hint && <p className="text-xs text-mist/70 mt-1">{hint}</p>}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="adm-label">{label}</label>
      {children}
    </div>
  );
}

export function LangTabs({ value, onChange }: { value: string; onChange: (l: string) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-night-line overflow-hidden">
      {['ru', 'en', 'zh'].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={`px-4 py-1.5 text-xs uppercase tracking-wider transition-colors ${
            value === l ? 'bg-gold text-night font-semibold' : 'text-mist hover:text-white'
          }`}
        >
          {l === 'zh' ? '中文' : l}
        </button>
      ))}
    </div>
  );
}

export function Toast({ message, error }: { message: string; error?: boolean }) {
  if (!message) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm shadow-xl animate-fade-in ${error ? 'bg-red-500/90 text-white' : 'bg-gold text-night font-medium'}`}>
      {message}
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return <p className="text-center text-mist py-16">{text}</p>;
}
