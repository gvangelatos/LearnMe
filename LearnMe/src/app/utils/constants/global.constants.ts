import { WordCardModel } from '../../swiper-tab/tab1.models';

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

export interface Mistake {
  wordID: string;
  times: number;
}

export interface WordMistake extends Mistake {
  word: WordCardModel;
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

export enum TabsLabelsEnum {
  Settings = 'settings',
  Mistakes = 'My Mistakes',
  Articles = 'Articles',
  Translations = 'Translations',
  WordMatches = 'Word match',
  Search = 'Search',
  Statistics = 'Statistics',
  Swiper = 'Swiper',
}

export const AVAILABLE_TABS_CONFIGURATIONS = [
  {
    iconActive: 'settings-outline',
    path: '/settings',
    label: TabsLabelsEnum.Settings,
  },
  {
    iconActive: 'thunderstorm-outline',
    path: '/mistakes',
    label: TabsLabelsEnum.Mistakes,
  },
  {
    iconActive: 'grid',
    icon: 'grid-outline',
    path: '/tabs/articles',
    label: TabsLabelsEnum.Articles,
  },
  {
    iconActive: 'language',
    icon: 'language-outline',
    path: '/tabs/translations',
    label: TabsLabelsEnum.Translations,
  },
  {
    iconActive: 'shuffle',
    icon: 'shuffle-outline',
    path: '/tabs/matching',
    label: TabsLabelsEnum.WordMatches,
  },
  {
    iconActive: 'search',
    icon: 'search-outline',
    path: '/tabs/search',
    label: TabsLabelsEnum.Search,
  },
  {
    iconActive: 'stats-chart',
    icon: 'stats-chart-outline',
    path: '/tabs/statistics',
    label: TabsLabelsEnum.Statistics,
  },
  {
    path: '/tabs/swiper',
    label: TabsLabelsEnum.Swiper,
    src: './assets/svg/swipe-cards-filled.icon.svg',
  },
];
