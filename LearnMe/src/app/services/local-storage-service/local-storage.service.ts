import { Injectable } from '@angular/core';
import {
  LocalStorageKeysEnum,
  SWIPER_PAGE_BASE_LOCAL_STORAGE_VALUE,
  SwiperPageLocalStorageDataType,
  SwiperPageMonthStats,
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
    const swiperPageStatistics: SwiperPageLocalStorageDataType =
      this.handleSwiperLocalStorageDataRetrieval();
    const yearMonth = this.getYearMonth();
    const current: SwiperPageMonthStats = swiperPageStatistics.byMonth[
      yearMonth
    ] ?? {
      successes: 0,
      fails: 0,
    };
    const newSwiperPageStatistics = {
      ...swiperPageStatistics,
      totalFails: swiperPageStatistics.totalFails + 1,
      byMonth: {
        ...swiperPageStatistics.byMonth,
        [yearMonth]: {
          ...current,
          fails: current.fails + 1,
        },
      },
    };
    this.setItem(LocalStorageKeysEnum.SwiperPage, newSwiperPageStatistics);
  }

  addSwiperPageSuccess(): void {
    const swiperPageStatistics: SwiperPageLocalStorageDataType =
      this.handleSwiperLocalStorageDataRetrieval();
    const yearMonth = this.getYearMonth();
    const current: SwiperPageMonthStats = swiperPageStatistics.byMonth[
      yearMonth
    ] ?? {
      successes: 0,
      fails: 0,
    };
    const newSwiperPageStatistics = {
      ...swiperPageStatistics,
      totalSuccesses: swiperPageStatistics.totalSuccesses + 1,
      byMonth: {
        ...swiperPageStatistics.byMonth,
        [yearMonth]: {
          ...current,
          successes: current.successes + 1,
        },
      },
    };
    this.setItem(LocalStorageKeysEnum.SwiperPage, newSwiperPageStatistics);
  }

  private getYearMonth(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based
    return `${year}-${month}`;
  }

  private handleSwiperLocalStorageDataRetrieval(): SwiperPageLocalStorageDataType {
    let swiperPageStatistics = this.getItem<SwiperPageLocalStorageDataType>(
      LocalStorageKeysEnum.SwiperPage,
    );
    if (!swiperPageStatistics) {
      this.setItem(
        LocalStorageKeysEnum.SwiperPage,
        SWIPER_PAGE_BASE_LOCAL_STORAGE_VALUE,
      );
      swiperPageStatistics = SWIPER_PAGE_BASE_LOCAL_STORAGE_VALUE;
    }
    return swiperPageStatistics;
  }

  private clear(): void {
    localStorage.clear();
  }
}
