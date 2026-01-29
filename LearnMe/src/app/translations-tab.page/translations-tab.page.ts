import { Component, effect, inject, signal } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonLabel,
  IonModal,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { GsApiService } from '../services/gs-api/gs-api.service';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';
import { WordCardModel } from '../swiper-tab/tab1.models';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, languageOutline } from 'ionicons/icons';
import { map, take } from 'rxjs';
import { TitleCasePipe } from '@angular/common';
import { UtilityService } from '../services/utility/utility.service';

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

  constructor() {
    addIcons({ arrowForwardOutline });
    effect(() => {
      if (this.wordSets().length < WORDS_SETS_LENGTH) {
        this.getWordsSet();
      }
    });
  }

  private getWordsSet() {
    this.gsApiService
      .getRandomWords()
      .pipe(
        map((words) => {
          const answers = this.utilityService.shuffleArray(
            words.map((x) => x.english_translation),
          );
          const correctAnswer = answers.findIndex(
            (answer) =>
              answer.toLowerCase() ===
              words[0]?.english_translation?.toLowerCase(),
          );
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
      this.wordSets()[0].answers[this.chosenAnswer].toLowerCase() ===
        this.wordSets()[0].words[0]?.english_translation?.toLowerCase()
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

  protected handleRefresh() {
    this.resetQuestion();
  }
}
