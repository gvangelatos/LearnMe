import { Component, effect, inject, signal } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonSpinner,
  IonText,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { GsApiService } from '../services/gs-api/gs-api.service';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';
import { WordCardModel } from '../swiper-tab/tab1.models';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, settingsOutline } from 'ionicons/icons';
import { map, take } from 'rxjs';
import { TitleCasePipe } from '@angular/common';
import { UtilityService } from '../services/utility/utility.service';
import { FormsModule } from '@angular/forms';
import { LocalStorageKeysEnum } from '../utils/constants/global.constants';

const WORDS_SETS_LENGTH: number = 3;

@Component({
  selector: 'app-translations-tab.page',
  templateUrl: './translations-tab.page.html',
  styleUrls: ['./translations-tab.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    IonText,
    IonButton,
    TitleCasePipe,
    IonModal,
    IonButtons,
    IonIcon,
    IonList,
    IonItem,
    IonToggle,
    FormsModule,
    IonSkeletonText,
  ],
})
export class TranslationsTabPage {
  private readonly gsApiService = inject(GsApiService);
  private readonly utilityService = inject(UtilityService);
  private readonly localStorageService = inject(LocalStorageService);
  protected wordSets = signal<
    {
      words: WordCardModel[];
      answers: string[];
      correctAnswer: number;
    }[]
  >([]);
  protected isCorrect: boolean = false;
  protected answered: boolean = false;
  protected chosen: boolean = false;
  protected chosenAnswer?: number;
  protected germanEnabled: boolean = false;

  constructor() {
    this.getIsGermanEnabledStorageData();
    addIcons({ arrowForwardOutline, settingsOutline });
    effect(() => {
      if (this.wordSets().length < WORDS_SETS_LENGTH) {
        this.getWordsSet();
      }
    });
  }

  ionViewWillEnter() {
    this.getIsGermanEnabledStorageData(true);
  }

  private getIsGermanEnabledStorageData(refreshIfChanged: boolean = false) {
    const isGermanEnabledStorageData =
      this.localStorageService.getItem<boolean>(
        LocalStorageKeysEnum.GermanEnabled,
      );
    if (isGermanEnabledStorageData === null) {
      this.germanEnabled = false;
      this.localStorageService.setItem(
        LocalStorageKeysEnum.GermanEnabled,
        false,
      );
      if (refreshIfChanged) {
        this.toggleGerman({ detail: { checked: false } });
      }
    } else {
      if (
        refreshIfChanged &&
        this.germanEnabled !== isGermanEnabledStorageData
      ) {
        this.toggleGerman({ detail: { checked: isGermanEnabledStorageData } });
      }
      this.germanEnabled = isGermanEnabledStorageData;
    }
  }

  private getWordsSet() {
    this.gsApiService
      .getRandomWords()
      .pipe(
        map((words) => {
          let answers: string[];
          let correctAnswer: number;
          if (this.germanEnabled) {
            answers = this.utilityService.shuffleArray(
              words.map((x) => x.german_translation),
            );
            correctAnswer = answers.findIndex(
              (answer) =>
                answer.toLowerCase() ===
                words[0]?.german_translation?.toLowerCase(),
            );
          } else {
            answers = this.utilityService.shuffleArray(
              words.map((x) => x.english_translation),
            );
            correctAnswer = answers.findIndex(
              (answer) =>
                answer.toLowerCase() ===
                words[0]?.english_translation?.toLowerCase(),
            );
          }

          return {
            words,
            answers,
            correctAnswer,
          };
        }),
        take(1),
      )
      .subscribe({
        next: (result) => {
          this.wordSets.update((sets) => {
            sets.push({ ...result });
            return [...sets];
          });
        },
        error: (error) => {},
      });
  }

  private resetQuestion() {
    this.chosen = false;
    this.answered = false;
    this.chosenAnswer = undefined;
    this.isCorrect = false;
    this.wordSets.update((sets) => sets.splice(1));
  }

  protected answeredClicked(answer: string, index: number) {
    if (!this.wordSets()[0].words[0] || this.answered) {
      return;
    }
    this.chosenAnswer = index;
    this.chosen = true;
  }

  protected checkAnswer() {
    if (!this.chosen) {
      return;
    }
    this.answered = true;
    if (
      typeof this.chosenAnswer === 'number' &&
      this.chosenAnswer === this.wordSets()[0].correctAnswer
    ) {
      this.handleAnswer(true);
    } else {
      this.handleAnswer(false);
    }
  }

  private handleAnswer(correct: boolean) {
    correct
      ? this.localStorageService.addTranslationsPageSuccess()
      : this.localStorageService.addTranslationsPageFailure();
    this.isCorrect = correct;
    this.answered = true;
  }

  protected getButtonColor(index: number) {
    if (!this.answered && !this.chosen) {
      return 'dark';
    }
    if (this.chosen && !this.answered && index === this.chosenAnswer) {
      return 'warning';
    }
    if (
      index === this.wordSets()[0].correctAnswer &&
      this.answered &&
      this.chosen
    ) {
      return 'success';
    }
    if (index === this.chosenAnswer) {
      return 'danger';
    }
    return 'dark';
  }

  protected getTextColor() {
    if (!this.answered) {
      return 'dark';
    }
    if (this.isCorrect) {
      return 'success';
    } else {
      return 'danger';
    }
  }

  protected toggleGerman(event: { detail: { checked: boolean } }) {
    this.localStorageService.setItem(
      LocalStorageKeysEnum.GermanEnabled,
      event?.detail?.checked,
    );
    this.chosen = false;
    this.answered = false;
    this.chosenAnswer = undefined;
    this.isCorrect = false;
    this.wordSets.set([]);
  }

  protected handleRefresh() {
    this.resetQuestion();
  }
}
