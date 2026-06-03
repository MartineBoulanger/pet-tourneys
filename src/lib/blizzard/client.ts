import { getBattleNetToken } from './token';

const BLIZZARD_BASE_URL = 'https://{region}.api.blizzard.com';

type BlizzardRegion = 'us' | 'eu' | 'kr' | 'tw';

type BlizzardFetchOptions = Omit<RequestInit, 'headers'> & {
  region?: BlizzardRegion;
  namespace?: string;
  locale?: string;
  headers?: Record<string, string>;
};

export async function blizzardFetch<T = unknown>(
  path: string,
  options: BlizzardFetchOptions = {},
): Promise<T> {
  const {
    region = 'eu',
    namespace = 'static',
    locale = 'en_GB',
    headers = {},
    ...rest
  } = options;

  const token = await getBattleNetToken();
  const baseUrl = BLIZZARD_BASE_URL.replace('{region}', region);
  const url = new URL(path, baseUrl);
  url.searchParams.set('locale', locale);

  if (namespace) url.searchParams.set('namespace', namespace);

  const res = await fetch(url.toString(), {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(
      `Blizzard API error [${res.status}] on ${url.toString()}: ${res.statusText}`,
    );
  }

  return res.json() as Promise<T>;
}
