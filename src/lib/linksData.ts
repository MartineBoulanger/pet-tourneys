import { LinksDataArray } from '@/types';

export const linksData: LinksDataArray = {
  tournament: [
    {
      id: 1,
      url_prefix: '/tournaments/',
      url_suffix: '/statistics',
      text: 'View Tourney Pets Statistics',
    },
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
      url_suffix: '/statistics?matchId=',
      text: 'View Match Pet Usage',
    },
    {
      id: 2,
      url_prefix: '/tournaments/',
      text: 'Back to Tournament',
    },
  ],
};
