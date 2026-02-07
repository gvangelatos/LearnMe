import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
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
import { trashOutline, shareOutline } from 'ionicons/icons';
import { ClearStatisticsComponent } from './components/clear-statistics/clear-statistics.component';
import { HapticsService } from '../services/haptics/haptics.service';
import domtoimage from 'dom-to-image';
import { SharingService } from '../services/sharing-service/sharing.service';

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
    IonFab,
    IonFabButton,
  ],
})
export class StatisticsTabPage {
  private readonly sharingService = inject(SharingService);
  private readonly hapticsService = inject(HapticsService);
  private readonly localStorageService = inject(LocalStorageService);
  private swiperPageData?: PageLocalStorageDataType;
  private translationsPageData?: PageLocalStorageDataType;
  private searchPageData?: SearchPageLocalStorageDataType;
  private wordMatchPageData?: PageLocalStorageDataType;
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
  protected translationsTotalResults: { name: string; value: number }[] = [];
  protected translationsTotalResultsVS: { name: string; value: number }[] = [];
  protected wordMatchTotalResults: { name: string; value: number }[] = [];
  protected wordMatchTotalResultsVS: { name: string; value: number }[] = [];
  protected searchTotalResults: { name: string; value: number }[] = [];
  protected searchTotalResultsVS: { name: string; value: number }[] = [];
  protected activeSegment: SegmentsLabels = SegmentsLabels.SwiperPage;
  protected sharingEnabled: boolean = false;

  constructor() {
    addIcons({ trashOutline, shareOutline });
    this.sharingEnabled = this.sharingService.initializeSharing();
  }

  ionViewDidEnter() {
    this.getDataFromLocalStorage();
    this.sharingEnabled = this.sharingService.initializeSharing();
  }

  protected getDataFromLocalStorage() {
    this.getSwiperPageData();
    this.getArticlesPageData();
    this.getSearchPageData();
    this.getTranslationsPageData();
    this.getWordMatchPageData();
  }

  protected share() {
    this.vibrate();
    this.sharingService.shareGraphs(
      this.activeSegment,
      `Hey, Look how i am doing at the ${this.activeSegment.toUpperCase()} minigame in LearnMe!`,
      this.activeSegment,
    );
  }

  protected getWordMatchPageData() {
    this.wordMatchPageData =
      this.localStorageService.handleLocalStorageDataRetrieval(
        LocalStorageKeysEnum.MatchPage,
      );
    this.wordMatchTotalResults = [
      {
        name: 'Total Matches',
        value:
          this.wordMatchPageData.totalSuccesses +
          this.wordMatchPageData.totalFails,
      },
      {
        name: 'Correct Matches',
        value: this.wordMatchPageData.totalSuccesses,
      },
      {
        name: 'Wrong Matches',
        value: this.wordMatchPageData.totalFails,
      },
    ];
    this.wordMatchTotalResultsVS = [
      {
        name: 'Right Matches',
        value: this.wordMatchPageData.totalSuccesses,
      },
      {
        name: 'Correct Matches',
        value: this.wordMatchPageData.totalFails,
      },
    ];
  }

  protected vibrate() {
    this.hapticsService.vibrateDefault();
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

  protected getTranslationsPageData() {
    this.translationsPageData =
      this.localStorageService.handleLocalStorageDataRetrieval(
        LocalStorageKeysEnum.TranslationsPage,
      );
    this.translationsTotalResults = [
      {
        name: 'Total Rounds',
        value:
          this.translationsPageData.totalSuccesses +
          this.translationsPageData.totalFails,
      },
      {
        name: 'Right Answers',
        value: this.translationsPageData.totalSuccesses,
      },
      {
        name: 'Wrong Answers',
        value: this.translationsPageData.totalFails,
      },
    ];
    this.translationsTotalResultsVS = [
      {
        name: 'Right Answers',
        value: this.translationsPageData.totalSuccesses,
      },
      {
        name: 'Wrong Answers',
        value: this.translationsPageData.totalFails,
      },
    ];
  }

  protected getArticlesPageData() {
    this.translationsPageData =
      this.localStorageService.handleLocalStorageDataRetrieval(
        LocalStorageKeysEnum.ArticlesPage,
      );
    this.articlesTotalResults = [
      {
        name: 'Total Rounds',
        value:
          this.translationsPageData.totalSuccesses +
          this.translationsPageData.totalFails,
      },
      {
        name: 'Right Answers',
        value: this.translationsPageData.totalSuccesses,
      },
      {
        name: 'Wrong Answers',
        value: this.translationsPageData.totalFails,
      },
    ];
    this.articlesTotalResultsVS = [
      {
        name: 'Right Answers',
        value: this.translationsPageData.totalSuccesses,
      },
      {
        name: 'Wrong Answers',
        value: this.translationsPageData.totalFails,
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
