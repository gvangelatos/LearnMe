import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { HapticsService } from '../services/haptics/haptics.service';
import { MistakesService } from '../services/mistakes-service/mistakes.service';
import { Mistake, WordMistake } from '../utils/constants/global.constants';
import { GsApiService } from '../services/gs-api/gs-api.service';
import { take } from 'rxjs';
import { WordCardModel } from '../swiper-tab/tab1.models';
import { BarChartModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';

enum SelectionsEnum {
  Graph = 'graph',
  Cards = 'cards',
}

@Component({
  selector: 'app-mistakes.page',
  templateUrl: './mistakes.page.html',
  styleUrls: ['./mistakes.page.scss'],
  imports: [
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    BarChartModule,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    FormsModule,
    IonCard,
    IonCardContent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MistakesPage {
  private readonly gsApiService = inject(GsApiService);
  private readonly hapticsService = inject(HapticsService);
  private readonly mistakesService = inject(MistakesService);
  protected wordsMistakes: WordMistake[] = [];
  protected visualizationChartData: { name: string; value: number }[] = [];
  protected visualizationType: SelectionsEnum = SelectionsEnum.Cards;
  private mistakes: Mistake[] = [];

  ionViewWillEnter() {
    const mistakesArray = this.mistakesService.initializeMistakes() ?? [];
    this.mistakes = mistakesArray.sort(this.sort);
    this.mistakes = this.mistakes.slice(0, 10);
    this.gsApiService
      .getSpecificWordsData(
        this.mistakes.map((m) => +m.wordID),
        this.mistakes.length,
      )
      .pipe(take(1))
      .subscribe((results: WordCardModel[]) => {
        this.wordsMistakes = [];
        results.forEach((result) => {
          const mistakeObj = this.mistakes.find(
            (x) => +x.wordID === +result.id,
          );
          if (mistakeObj) {
            this.wordsMistakes.push({
              ...mistakeObj,
              word: { ...result },
            });
          }
        });
        this.visualizationChartData = this.wordsMistakes
          .sort(this.sort)
          .map((m) => {
            return {
              value: m.times,
              name: m.word.german_translation,
            };
          });
      });
  }

  protected vibrate() {
    this.hapticsService.vibrateDefault();
  }

  private sort(a: Mistake, b: Mistake) {
    if (a.times < b.times) return 1;
    if (a.times > b.times) return -1;

    if (a.wordID < b.wordID) return -1;
    if (a.wordID > b.wordID) return 1;

    return 0; // a and b are equal, remain in same position
  }

  protected readonly SelectionsEnum = SelectionsEnum;
}
