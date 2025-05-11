import { LinksDataArray } from '@/types';

export const linksData: LinksDataArray = {
  tournament: [
    {
      id: 1,
      url_prefix: '/tournaments/',
      url_suffix: '/statistics/pet-usage',
      text: 'View Pet Usage Statistics',
    },
    // {
    //   id: 2,
    //   url_prefix: '/tournaments/',
    //   url_suffix: '/statistics/battle-logs',
    //   text: 'View Battle Logs Statistics',
    // },
    {
      id: 2,
      full_url: '/tournaments',
      text: 'Back To Tournaments List',
    },
  ],
  statistics: [
    {
      id: 1,
      url_prefix: '/tournaments/',
      url_suffix: '/matches/',
    },
  ],
  match: [
    {
      id: 1,
      url_prefix: '/tournaments/',
      url_suffix: '/statistics/pet-usage?matchId=',
      text: 'View Pet Usage Statistics',
    },
    // {
    //   id: 2,
    //   url_prefix: '/tournaments/',
    //   url_suffix: '/statistics/battle-logs?matchId=',
    //   text: 'View Battle Logs Statistics',
    // },
    {
      id: 2,
      url_prefix: '/tournaments/',
      text: 'Back to Tournament',
    },
  ],
};

// TODO: use this website as example for making statistics per pet -> https://pvpoke.com/rankings/all/10000/overall/tapu_bulu/ -> also you have to make pet data for this, but not sure if this should be set in Supabase or just aset as JSONs in the project folder -> opt for the second one first
// TODO: also try to make the statistics more graphicy to view at -> ie with more graphs, and also graphs like the ones on the example website.
