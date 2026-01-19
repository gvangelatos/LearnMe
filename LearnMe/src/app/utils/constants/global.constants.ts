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
