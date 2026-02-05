import { Component, inject, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonText,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settings } from 'ionicons/icons';
import {
  AVAILABLE_TABS_CONFIGURATIONS,
  LocalStorageKeysEnum,
  PageLocalStorageDataType,
  PageMonthStats,
} from '../utils/constants/global.constants';
import { AnimationController } from '@ionic/angular';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';
import {
  BarChartModule,
  GaugeModule,
  LegendPosition,
} from '@swimlane/ngx-charts';
import { RouterLink } from '@angular/router';

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
  ],
})
export class HomePage {
  private readonly navController = inject(NavController);
  private readonly animationCtrl = inject(AnimationController);
  private readonly localStorageService = inject(LocalStorageService);
  protected totalResults: { name: string; value: number }[] = [];
  private totalData: PageLocalStorageDataType = {
    totalSuccesses: 0,
    totalFails: 0,
    byMonth: {},
  };

  constructor() {
    addIcons({ settings });
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
    console.log(this.totalResults);
  }

  protected readonly AVAILABLE_TABS_CONFIGURATIONS =
    AVAILABLE_TABS_CONFIGURATIONS;
  protected readonly LegendPosition = LegendPosition;
}
