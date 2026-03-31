export const dynamic = 'force-dynamic'; // TODO: dit is een snelle oplossing voor nu, moet anders geaan worden deze hele sitemap
import type { MetadataRoute } from 'next';
import { getLeaguesForForm } from '@/actions/supabase/api-schema/leagues/getLeagues';
import { getMatches } from '@/actions/supabase/api-schema/matches/getMatches';
import { getPages } from '@/actions/supabase/cms-schema/pages/getPages';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.BASE_URL!;
  const { data: leagues } = await getLeaguesForForm();
  const guidesPages = await getPages('guides');
  const articlesPages = await getPages('articles');
  const reviewsPages = await getPages('pet-reviews');
  // Base URLs that don't depend on dynamic data
  const staticUrls = [
    {
      url: url,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
    {
      url: `${url}/leagues`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${url}/leagues/rules`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${url}/leagues/prizes`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${url}/resources`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${url}/cookies-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${url}/guides`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${url}/articles`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${url}/pet-reviews`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${url}/analyze-tool`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${url}/pets`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  if (!leagues || leagues.length === 0) {
    return staticUrls;
  }

  // Process tournaments and their matches in parallel
  const tournamentEntries = await Promise.all(
    leagues.map(async (tournament) => {
      const matches = await getMatches(tournament.id);

      const tournamentEntry = {
        url: `${url}/leagues/${tournament.id}`,
        lastModified: new Date(tournament.created_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };

      const tournamentStatisticsEntry = {
        url: `${url}/leagues/${tournament.id}/statistics`,
        lastModified: new Date(tournament.created_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };

      const tournamentPetsStatisticsEntry = {
        url: `${url}/leagues/${tournament.id}/statistics/pets`,
        lastModified: new Date(tournament.created_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };

      const matchEntries =
        matches?.data?.map((match) => ({
          url: `${url}/leagues/${tournament.id}/match/${match.id}`,
          lastModified: new Date(match.date || new Date()),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        })) || [];

      const matchStatsEntries =
        matches?.data?.map((match) => ({
          url: `${url}/leagues/${tournament.id}/match/${match.id}/statistics?matchId=${match.id}`,
          lastModified: new Date(match.date || new Date()),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        })) || [];

      const matchPetsStatsEntries =
        matches?.data?.map((match) => ({
          url: `${url}/leagues/${tournament.id}/match/${match.id}/statistics/pets?matchId=${match.id}`,
          lastModified: new Date(match.date || new Date()),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        })) || [];

      return [
        tournamentEntry,
        tournamentStatisticsEntry,
        tournamentPetsStatisticsEntry,
        ...matchEntries,
        ...matchStatsEntries,
        ...matchPetsStatsEntries,
      ];
    }),
  );

  // Flatten the array of arrays into a single array
  const dynamicUrls = tournamentEntries.flat();

  // Use this as example for other pages
  const allGuides = guidesPages?.data
    ?.map((guide: { slug: string }) => {
      const guideEntry = {
        url: `${url}/guides/${guide.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };
      return [guideEntry];
    })
    .flat();

  const allArticles = articlesPages?.data
    ?.map((article: { slug: string }) => {
      const articleEntry = {
        url: `${url}/articles/${article.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };
      return [articleEntry];
    })
    .flat();

  const allReviews = reviewsPages?.data
    ?.map((review: { slug: string }) => {
      const reviewEntry = {
        url: `${url}/pet-reviews/${review.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };
      return [reviewEntry];
    })
    .flat();

  return [
    ...staticUrls,
    ...dynamicUrls,
    ...(allGuides || []),
    ...(allArticles || []),
    ...(allReviews || []),
  ];
}
