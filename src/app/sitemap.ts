import type { MetadataRoute } from 'next';
import { getTournamentsForForm } from '@/features/supabase/actions/tournaments';
import { getMatches } from '@/features/supabase/actions/matches';
import { getPagesByType } from '@/features/cms/actions/pages';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.BASE_URL!;
  const {
    data: { tournaments },
  } = await getTournamentsForForm();
  const guidesPages = await getPagesByType('guides');
  const articlesPages = await getPagesByType('articles');
  const reviewsPages = await getPagesByType('pet-reviews');
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
    {
      url: `${url}/tournaments/rules`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${url}/tournaments/prizes`,
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
      url: `${url}/privacy-policy`,
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

      const tournamentStatisticsEntry = {
        url: `${url}/tournaments/${tournament.id}/statistics`,
        lastModified: new Date(tournament.created_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };

      const tournamentPetsStatisticsEntry = {
        url: `${url}/tournaments/${tournament.id}/statistics/pet-stats`,
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

      const matchStatsEntries =
        matches?.map((match) => ({
          url: `${url}/tournaments/${tournament.id}/matches/${match.id}/statistics?matchId=${match.id}`,
          lastModified: new Date(match.date || new Date()),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        })) || [];

      const matchPetsStatsEntries =
        matches?.map((match) => ({
          url: `${url}/tournaments/${tournament.id}/matches/${match.id}/statistics/pet-stats?matchId=${match.id}`,
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
    })
  );

  // Flatten the array of arrays into a single array
  const dynamicUrls = tournamentEntries.flat();

  // Use this as example for other pages
  const allGuides = guidesPages
    .map((guide: { slug: string }) => {
      const guideEntry = {
        url: `${url}/guides/${guide.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };
      return [guideEntry];
    })
    .flat();

  const allArticles = articlesPages
    .map((article: { slug: string }) => {
      const articleEntry = {
        url: `${url}/articles/${article.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };
      return [articleEntry];
    })
    .flat();

  const allReviews = reviewsPages
    .map((review: { slug: string }) => {
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
    ...allGuides,
    ...allArticles,
    ...allReviews,
  ];
}
