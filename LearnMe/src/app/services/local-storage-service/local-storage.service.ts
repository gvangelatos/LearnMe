import { Injectable } from '@angular/core';
import {
  LocalStorageKeysEnum,
  PAGE_BASE_LOCAL_STORAGE_VALUE,
  PageLocalStorageDataType,
  PageMonthStats,
  SEARCH_PAGE_BASE_LOCAL_STORAGE_VALUE,
  SearchPageLocalStorageDataType,
  SearchPageMonthStats,
} from '../../utils/constants/global.constants';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private setItem(key: LocalStorageKeysEnum, value: any): void {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
  }

  private getItem<T>(key: LocalStorageKeysEnum): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error reading from local storage', error);
      return null;
    }
  }

  removeItem(key: LocalStorageKeysEnum): void {
    localStorage.removeItem(key);
  }

  addSwiperPageFailure(): void {
    const swiperPageStatistics: PageLocalStorageDataType =
      this.handleLocalStorageDataRetrieval(LocalStorageKeysEnum.SwiperPage);
    this.applyPageFailure(
      LocalStorageKeysEnum.SwiperPage,
      swiperPageStatistics,
    );
  }

  addSearchPageSearch(emptyResults: boolean) {
    const searchPageStatistics: SearchPageLocalStorageDataType =
      this.handleSearchPageLocalStorageDataRetrieval();
    emptyResults
      ? this.applySearchPageIncrementEmpty(searchPageStatistics)
      : this.applySearchPageIncrement(searchPageStatistics);
  }

  addArticlesPageSuccess(): void {
    const articlesPageStatistics: PageLocalStorageDataType =
      this.handleLocalStorageDataRetrieval(LocalStorageKeysEnum.ArticlesPage);
    this.applyPageSuccess(
      LocalStorageKeysEnum.ArticlesPage,
      articlesPageStatistics,
    );
  }

  addArticlesPageFailure(): void {
    const articlesPageStatistics: PageLocalStorageDataType =
      this.handleLocalStorageDataRetrieval(LocalStorageKeysEnum.ArticlesPage);
    this.applyPageFailure(
      LocalStorageKeysEnum.ArticlesPage,
      articlesPageStatistics,
    );
  }

  addSwiperPageSuccess(): void {
    const swiperPageStatistics: PageLocalStorageDataType =
      this.handleLocalStorageDataRetrieval(LocalStorageKeysEnum.SwiperPage);
    this.applyPageSuccess(
      LocalStorageKeysEnum.SwiperPage,
      swiperPageStatistics,
    );
  }

  private applySearchPageIncrement(
    pageStatistics: SearchPageLocalStorageDataType,
  ): void {
    const yearMonth = this.getYearMonth();
    const current: SearchPageMonthStats = pageStatistics.byMonth[yearMonth] ?? {
      searches: 0,
      successSearches: 0,
      emptySearches: 0,
    };
    const newPageStatistics = {
      ...pageStatistics,
      totalSearches: pageStatistics.totalSearches + 1,
      totalSuccessSearches: pageStatistics.totalSuccessSearches + 1,
      byMonth: {
        ...pageStatistics.byMonth,
        [yearMonth]: {
          ...current,
          searches: current.searches + 1,
          successSearches: current.successSearches + 1,
        },
      },
    };
    this.setItem(LocalStorageKeysEnum.SearchPage, newPageStatistics);
  }

  private applySearchPageIncrementEmpty(
    pageStatistics: SearchPageLocalStorageDataType,
  ): void {
    const yearMonth = this.getYearMonth();
    const current: SearchPageMonthStats = pageStatistics.byMonth[yearMonth] ?? {
      searches: 0,
      successSearches: 0,
      emptySearches: 0,
    };
    const newPageStatistics = {
      ...pageStatistics,
      totalSearches: pageStatistics.totalSearches + 1,
      totalEmptySearches: pageStatistics.totalEmptySearches + 1,
      byMonth: {
        ...pageStatistics.byMonth,
        [yearMonth]: {
          ...current,
          searches: current.searches + 1,
          emptySearches: current.emptySearches + 1,
        },
      },
    };
    this.setItem(LocalStorageKeysEnum.SearchPage, newPageStatistics);
  }

  private applyPageSuccess(
    key: LocalStorageKeysEnum,
    pageStatistics: PageLocalStorageDataType,
  ): void {
    const yearMonth = this.getYearMonth();
    const current: PageMonthStats = pageStatistics.byMonth[yearMonth] ?? {
      successes: 0,
      fails: 0,
    };
    const newPageStatistics = {
      ...pageStatistics,
      totalSuccesses: pageStatistics.totalSuccesses + 1,
      byMonth: {
        ...pageStatistics.byMonth,
        [yearMonth]: {
          ...current,
          successes: current.successes + 1,
        },
      },
    };
    this.setItem(key, newPageStatistics);
  }

  private applyPageFailure(
    key: LocalStorageKeysEnum,
    pageStatistics: PageLocalStorageDataType,
  ): void {
    const yearMonth = this.getYearMonth();
    const current: PageMonthStats = pageStatistics.byMonth[yearMonth] ?? {
      successes: 0,
      fails: 0,
    };
    const newPageStatistics = {
      ...pageStatistics,
      totalFails: pageStatistics.totalFails + 1,
      byMonth: {
        ...pageStatistics.byMonth,
        [yearMonth]: {
          ...current,
          fails: current.fails + 1,
        },
      },
    };
    this.setItem(key, newPageStatistics);
  }

  private getYearMonth(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based
    return `${year}-${month}`;
  }

  handleLocalStorageDataRetrieval(
    key: LocalStorageKeysEnum,
  ): PageLocalStorageDataType {
    let pageStatistics = this.getItem<PageLocalStorageDataType>(key);
    if (!pageStatistics) {
      this.setItem(key, PAGE_BASE_LOCAL_STORAGE_VALUE);
      pageStatistics = PAGE_BASE_LOCAL_STORAGE_VALUE;
    }
    return pageStatistics;
  }

  handleSearchPageLocalStorageDataRetrieval(): SearchPageLocalStorageDataType {
    let searchPageStatistics = this.getItem<SearchPageLocalStorageDataType>(
      LocalStorageKeysEnum.SearchPage,
    );
    if (!searchPageStatistics) {
      this.setItem(
        LocalStorageKeysEnum.SearchPage,
        SEARCH_PAGE_BASE_LOCAL_STORAGE_VALUE,
      );
      searchPageStatistics = SEARCH_PAGE_BASE_LOCAL_STORAGE_VALUE;
    }
    return searchPageStatistics;
  }

  private clear(): void {
    localStorage.clear();
  }
}
