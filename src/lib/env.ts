export const REQUIRED_ENV = [
  { key: 'VITE_SUPABASE_URL', label: 'Supabase URL' },
  { key: 'VITE_SUPABASE_ANON_KEY', label: 'Supabase Anon Key' },
];

export function validateEnv(): string | null {
  const missing: string[] = [];
  for (const env of REQUIRED_ENV) {
    const value = import.meta.env?.[env.key];
    if (!value || value === 'undefined' || value === '') {
      missing.push(env.label);
    }
  }
  if (missing.length > 0) {
    return `Missing required environment variables: ${missing.join(', ')}`;
  }
  return null;
}

export function getEnv(key: string): string {
  const value = import.meta.env?.[key];
  if (!value || value === 'undefined') {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}
