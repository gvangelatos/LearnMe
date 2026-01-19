import { Injectable } from '@angular/core';
import {
  LocalStorageKeysEnum,
  PAGE_BASE_LOCAL_STORAGE_VALUE,
  PageLocalStorageDataType,
  PageMonthStats,
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

  private removeItem(key: LocalStorageKeysEnum): void {
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

  private handleLocalStorageDataRetrieval(
    key: LocalStorageKeysEnum,
  ): PageLocalStorageDataType {
    let swiperPageStatistics = this.getItem<PageLocalStorageDataType>(key);
    if (!swiperPageStatistics) {
      this.setItem(key, PAGE_BASE_LOCAL_STORAGE_VALUE);
      swiperPageStatistics = PAGE_BASE_LOCAL_STORAGE_VALUE;
    }
    return swiperPageStatistics;
  }

  private clear(): void {
    localStorage.clear();
  }
}
