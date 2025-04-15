import type { MetadataRoute } from 'next';
import { getTournaments } from '@/supabase/actions/tournaments';
import { getMatches } from '@/supabase/actions/matches';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_BASE_URL!;
  const {
    data: { tournaments },
  } = await getTournaments();

  // Base URLs that don't depend on dynamic data
  const staticUrls = [
    {
      url: url,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
    {
      url: `${url}/tournaments`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  if (!tournaments || tournaments.length === 0) {
    return staticUrls;
  }

  // Process tournaments and their matches in parallel
  const tournamentEntries = await Promise.all(
    tournaments.map(async (tournament) => {
      const matches = await getMatches(tournament.id);

      const tournamentEntry = {
        url: `${url}/tournaments/${tournament.id}`,
        lastModified: new Date(tournament.created_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };

      const matchEntries =
        matches?.map((match) => ({
          url: `${url}/tournaments/${tournament.id}/matches/${match.id}`,
          lastModified: new Date(match.date || new Date()),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        })) || [];

      return [tournamentEntry, ...matchEntries];
    })
  );

  // Flatten the array of arrays into a single array
  const dynamicUrls = tournamentEntries.flat();

  return [...staticUrls, ...dynamicUrls];
}
