import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settingsOutline } from 'ionicons/icons';
import {
  AVAILABLE_TABS_CONFIGURATIONS,
  LocalStorageKeysEnum,
  PageLocalStorageDataType,
} from '../utils/constants/global.constants';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';
import {
  BarChartModule,
  GaugeModule,
  LegendPosition,
} from '@swimlane/ngx-charts';
import { RouterLink } from '@angular/router';
import { HapticsService } from '../services/haptics/haptics.service';

@Component({
  selector: 'app-home.page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonText,
    GaugeModule,
    BarChartModule,
    RouterLink,
    IonButton,
    IonButtons,
  ],
})
export class HomePage {
  private readonly hapticsService = inject(HapticsService);
  private readonly localStorageService = inject(LocalStorageService);
  protected totalResults: { name: string; value: number }[] = [];
  private totalData: PageLocalStorageDataType = {
    totalSuccesses: 0,
    totalFails: 0,
    byMonth: {},
  };

  constructor() {
    addIcons({ settingsOutline });
  }

  ionViewDidEnter() {
    this.getPagesData();
  }

  protected getPagesData() {
    const swiperData = this.localStorageService.handleLocalStorageDataRetrieval(
      LocalStorageKeysEnum.SwiperPage,
    );

    const articlesData =
      this.localStorageService.handleLocalStorageDataRetrieval(
        LocalStorageKeysEnum.ArticlesPage,
      );

    const matchData = this.localStorageService.handleLocalStorageDataRetrieval(
      LocalStorageKeysEnum.MatchPage,
    );

    const translationsData =
      this.localStorageService.handleLocalStorageDataRetrieval(
        LocalStorageKeysEnum.TranslationsPage,
      );

    this.totalData.totalFails =
      swiperData.totalFails +
      articlesData.totalFails +
      matchData.totalFails +
      translationsData.totalFails;
    this.totalData.totalSuccesses =
      swiperData.totalSuccesses +
      articlesData.totalSuccesses +
      matchData.totalSuccesses +
      translationsData.totalSuccesses;

    this.totalResults = [
      {
        name: 'Correct Answers',
        value: this.totalData.totalSuccesses,
      },
      {
        name: 'Wrong Answers',
        value: this.totalData.totalFails,
      },
    ];
  }

  protected readonly AVAILABLE_TABS_CONFIGURATIONS =
    AVAILABLE_TABS_CONFIGURATIONS;
  protected readonly LegendPosition = LegendPosition;

  protected vibrate() {
    this.hapticsService.vibrateDefault();
  }
}
