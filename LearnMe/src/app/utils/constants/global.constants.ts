export interface PageLocalStorageDataType {
  totalSuccesses: number;
  totalFails: number;
  byMonth: Record<string, PageMonthStats>;
}

export interface PageMonthStats {
  successes: number;
  fails: number;
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
