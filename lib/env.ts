export function getEnvTrimmed(key: string): string | undefined {
  const raw = process.env[key];
  const value = typeof raw === 'string' ? raw.trim() : '';
  return value ? value : undefined;
}

export function getAnyEnvTrimmed(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = getEnvTrimmed(key);
    if (value) return value;
  }
  return undefined;
}

