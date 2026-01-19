export type YearMonth =
  `${number}-${'01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12'}`;

export interface SwiperPageLocalStorageDataType {
  totalSuccesses: number;
  totalFails: number;
  byMonth: Record<string, SwiperPageMonthStats>;
}

export interface SwiperPageMonthStats {
  successes: number;
  fails: number;
}

export enum LocalStorageKeysEnum {
  SwiperPage = 'swiperPageStatistics',
  SearchPage = 'searchPageStatistics',
  ArticlesPage = 'articlesPageStatistics',
}

export const SWIPER_PAGE_BASE_LOCAL_STORAGE_VALUE: SwiperPageLocalStorageDataType =
  {
    totalSuccesses: 0,
    totalFails: 0,
    byMonth: {},
  };
