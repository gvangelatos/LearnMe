import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';
import {
  LocalStorageKeysEnum,
  PageLocalStorageDataType,
  SearchPageLocalStorageDataType,
} from '../utils/constants/global.constants';
import { Color, LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { SegmentsLabels } from './statistics-tab.contants';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { ClearStatisticsComponent } from './components/clear-statistics/clear-statistics.component';

@Component({
  selector: 'app-statistics-tab',
  templateUrl: './statistics-tab.page.html',
  styleUrls: ['./statistics-tab.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    NgxChartsModule,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonSegmentView,
    IonSegmentContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonModal,
    ClearStatisticsComponent,
  ],
})
export class StatisticsTabPage {
  private readonly localStorageService = inject(LocalStorageService);
  private swiperPageData?: PageLocalStorageDataType;
  private articlesPageData?: PageLocalStorageDataType;
  private searchPageData?: SearchPageLocalStorageDataType;
  protected readonly dualColorSchemes = {
    domain: [
      getComputedStyle(document.documentElement)
        .getPropertyValue('--ion-color-success')
        .trim(),
      getComputedStyle(document.documentElement)
        .getPropertyValue('--ion-color-danger')
        .trim(),
    ],
  } as Color;

  protected readonly tripleColorSchemes = {
    domain: [
      getComputedStyle(document.documentElement)
        .getPropertyValue('--ion-color-primary')
        .trim(),
      getComputedStyle(document.documentElement)
        .getPropertyValue('--ion-color-success')
        .trim(),
      getComputedStyle(document.documentElement)
        .getPropertyValue('--ion-color-danger')
        .trim(),
    ],
  } as Color;

  protected swiperTotalResults: { name: string; value: number }[] = [];
  protected swiperTotalResultsVS: { name: string; value: number }[] = [];
  protected articlesTotalResults: { name: string; value: number }[] = [];
  protected articlesTotalResultsVS: { name: string; value: number }[] = [];
  protected searchTotalResults: { name: string; value: number }[] = [];
  protected searchTotalResultsVS: { name: string; value: number }[] = [];
  protected activeSegment: SegmentsLabels = SegmentsLabels.SwiperPage;

  constructor() {
    addIcons({ trashOutline });
  }

  ionViewDidEnter() {
    this.getDataFromLocalStorage();
  }

  protected getDataFromLocalStorage() {
    this.getSwiperPageData();
    this.getArticlesPageData();
    this.getSearchPageData();
  }

  protected segmentChange(event: any) {
    this.activeSegment = event.detail.value;
  }

  protected getSwiperPageData() {
    this.swiperPageData =
      this.localStorageService.handleLocalStorageDataRetrieval(
        LocalStorageKeysEnum.SwiperPage,
      );
    this.swiperTotalResults = [
      {
        name: 'Total Swipes',
        value:
          this.swiperPageData.totalSuccesses + this.swiperPageData.totalFails,
      },
      {
        name: 'Swiped right (Known)',
        value: this.swiperPageData.totalSuccesses,
      },
      {
        name: 'Swiped left (Unknown)',
        value: this.swiperPageData.totalFails,
      },
    ];
    this.swiperTotalResultsVS = [
      {
        name: 'Right (Known)',
        value: this.swiperPageData.totalSuccesses,
      },
      {
        name: 'Left (Unknown)',
        value: this.swiperPageData.totalFails,
      },
    ];
  }

  protected getArticlesPageData() {
    this.articlesPageData =
      this.localStorageService.handleLocalStorageDataRetrieval(
        LocalStorageKeysEnum.ArticlesPage,
      );
    this.articlesTotalResults = [
      {
        name: 'Total Rounds',
        value:
          this.articlesPageData.totalSuccesses +
          this.articlesPageData.totalFails,
      },
      {
        name: 'Right Answers',
        value: this.articlesPageData.totalSuccesses,
      },
      {
        name: 'Wrong Answers',
        value: this.articlesPageData.totalFails,
      },
    ];
    this.articlesTotalResultsVS = [
      {
        name: 'Right Answers',
        value: this.articlesPageData.totalSuccesses,
      },
      {
        name: 'Wrong Answers',
        value: this.articlesPageData.totalFails,
      },
    ];
  }

  protected getSearchPageData() {
    this.searchPageData =
      this.localStorageService.handleSearchPageLocalStorageDataRetrieval();
    this.searchTotalResults = [
      {
        name: 'Total Searches',
        value: this.searchPageData.totalSearches,
      },
      {
        name: 'Successful Searches',
        value: this.searchPageData.totalSuccessSearches,
      },
      {
        name: 'Empty Searches',
        value: this.searchPageData.totalEmptySearches,
      },
    ];
    this.searchTotalResultsVS = [
      {
        name: 'Successful Searches',
        value: this.searchPageData.totalSuccessSearches,
      },
      {
        name: 'Empty Searches',
        value: this.searchPageData.totalEmptySearches,
      },
    ];
  }

  protected readonly LegendPosition = LegendPosition;
  protected readonly SegmentsLabels = SegmentsLabels;
}
