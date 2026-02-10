export interface PageLocalStorageDataType {
  totalSuccesses: number;
  totalFails: number;
  byMonth: Record<string, PageMonthStats>;
}

export interface PageMonthStats {
  successes: number;
  fails: number;
}

export interface SearchPageLocalStorageDataType {
  totalSearches: number;
  totalSuccessSearches: number;
  totalEmptySearches: number;
  byMonth: Record<string, SearchPageMonthStats>;
}

export interface SearchPageMonthStats {
  searches: number;
  successSearches: number;
  emptySearches: number;
}

export enum LocalStorageKeysEnum {
  SwiperPage = 'swiperPageStatistics',
  SearchPage = 'searchPageStatistics',
  ArticlesPage = 'articlesPageStatistics',
  TranslationsPage = 'translationsPageStatistics',
  GermanEnabled = 'germanEnabled',
  MatchPage = 'matchPageStatistics',
  MatchPairs = 'matchPairsNumber',
  DarkMode = 'darkMode',
  Haptics = 'haptics',
  ToastMessages = 'toastMessages',
  Sharing = 'sharing',
  OftenMadeMistakes = 'oftenMadeMistakes',
}

export const PAGE_BASE_LOCAL_STORAGE_VALUE: PageLocalStorageDataType = {
  totalSuccesses: 0,
  totalFails: 0,
  byMonth: {},
};

export const SEARCH_PAGE_BASE_LOCAL_STORAGE_VALUE: SearchPageLocalStorageDataType =
  {
    totalSearches: 0,
    totalEmptySearches: 0,
    totalSuccessSearches: 0,
    byMonth: {},
  };

export const AVAILABLE_TABS_CONFIGURATIONS = [
  {
    iconActive: 'grid',
    icon: 'grid-outline',
    path: '/tabs/articles',
    label: 'Articles',
  },
  {
    iconActive: 'language',
    icon: 'language-outline',
    path: '/tabs/translations',
    label: 'Translations',
  },
  {
    iconActive: 'shuffle',
    icon: 'shuffle-outline',
    path: '/tabs/matching',
    label: 'Word Match',
  },
  {
    iconActive: 'search',
    icon: 'search-outline',
    path: '/tabs/search',
    label: 'Search',
  },
  {
    iconActive: 'stats-chart',
    icon: 'stats-chart-outline',
    path: '/tabs/statistics',
    label: 'Statistics',
  },
  {
    path: '/tabs/swiper',
    label: 'Swiper',
    src: './assets/svg/swipe-cards-filled.icon.svg',
  },
  // {
  //   iconActive: 'settings',
  //   icon: 'settings-outline',
  //   path: '/tabs/settings',
  //   label: 'Settings',
  // },
];
