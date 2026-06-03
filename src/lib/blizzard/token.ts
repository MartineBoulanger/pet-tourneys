const BLIZZARD_TOKEN_URL = 'https://oauth.battle.net/token';

type TokenCache = {
  accessToken: string;
  expiresAt: number;
};

let cache: TokenCache | null = null;

export async function getBattleNetToken(): Promise<string> {
  const now = Date.now();

  if (!cache || cache.expiresAt - now < 5 * 60 * 1000) {
    cache = await fetchNewToken();
  }

  return cache.accessToken;
}

async function fetchNewToken(): Promise<TokenCache> {
  const clientID = process.env.BLIZZARD_CLIENT_ID;
  const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;

  const credentials = Buffer.from(`${clientID}:${clientSecret}`).toString(
    'base64',
  );

  const res = await fetch(BLIZZARD_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch Blizzard token: ${res.status} ${res.statusText}`,
    );
  }

  const data = await res.json();

  return {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
}
