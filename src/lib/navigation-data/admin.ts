import { NavigationData } from '@/types/navigation-types';

export const adminData: NavigationData = [
  {
    id: 1,
    url: '/admin-panel/pets',
    linkText: 'Manage Pets Data',
    text: 'Manage all the pets in the database.',
    roleAllowed: 'admin',
  },
  {
    id: 2,
    url: '/admin-panel/images',
    linkText: 'Manage All Images',
    text: 'Manage all the images of recent and previous tournaments.',
    roleAllowed: 'both',
  },
];

export const leaguesAdminData: NavigationData = [
  {
    id: 1,
    url: '/admin-panel/leagues',
    linkText: 'Manage Leagues',
    text: 'Manage all leagues.',
    roleAllowed: 'admin',
  },
  {
    id: 2,
    url: '/admin-panel/leagues/rules',
    linkText: 'Manage Rules',
    text: 'Manage the rules of the league.',
    roleAllowed: 'admin',
  },
  {
    id: 3,
    url: '/admin-panel/leagues/prizes',
    linkText: 'Manage Prizes',
    text: 'Manage the prizes of the league.',
    roleAllowed: 'admin',
  },
  {
    id: 4,
    url: '/admin-panel/leagues/hall-of-fame',
    linkText: 'Manage Hall of Fame',
    text: 'Manage the hall of fame of the league.',
    roleAllowed: 'admin',
  },
];

export const contentManagementData: NavigationData = [
  {
    id: 1,
    url: '/admin-panel/content/announcements',
    linkText: 'Manage Announcements',
    text: 'Manage the announcements on the homepage.',
    roleAllowed: 'admin',
  },
  {
    id: 2,
    url: '/admin-panel/content/signups',
    linkText: 'Manage Signups',
    text: 'Manage the signups on the homepage.',
    roleAllowed: 'admin',
  },
  {
    id: 3,
    url: '/admin-panel/content/schedules',
    linkText: 'Manage Schedules',
    text: 'Manage the schedules on the homepage.',
    roleAllowed: 'admin',
  },
  {
    id: 4,
    url: '/admin-panel/content/partners',
    linkText: 'Manage Partners',
    text: 'Manage the partners on the homepage.',
    roleAllowed: 'admin',
  },
  {
    id: 5,
    url: '/admin-panel/content/resources',
    linkText: 'Manage Resources',
    text: 'Manage the resource sections for the resources page.',
    roleAllowed: 'admin',
  },
];

export const pagesManagementData: NavigationData = [
  {
    id: 1,
    url: '/admin-panel/pages/articles',
    linkText: 'Manage Articles',
    text: 'Manage all articles.',
    roleAllowed: 'both',
  },
  {
    id: 2,
    url: '/admin-panel/pages/guides',
    linkText: 'Manage Guides',
    text: 'Manage all guides.',
    roleAllowed: 'both',
  },
  {
    id: 3,
    url: '/admin-panel/pages/pet-reviews',
    linkText: 'Manage Pet Reviews',
    text: 'Manage all pet reviews.',
    roleAllowed: 'both',
  },
];
