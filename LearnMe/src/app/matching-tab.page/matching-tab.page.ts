import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonModal,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { WordCardModel } from '../swiper-tab/tab1.models';
import { GsApiService } from '../services/gs-api/gs-api.service';
import { UtilityService } from '../services/utility/utility.service';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';
import { map, take } from 'rxjs';
import { TitleCasePipe } from '@angular/common';
const WORDS_SETS_LENGTH: number = 3;
const WORDS_NUMBER_IN_ROUND: number = 5;
@Component({
  selector: 'app-matching-tab.page',
  templateUrl: './matching-tab.page.html',
  styleUrls: ['./matching-tab.page.scss'],
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonSpinner,
    TitleCasePipe,
    IonModal,
  ],
})
export class MatchingTabPage {
  private readonly gsApiService = inject(GsApiService);
  private readonly utilityService = inject(UtilityService);
  private readonly localStorageService = inject(LocalStorageService);
  protected wordSets = signal<
    {
      left: WordCardModel[];
      right: WordCardModel[];
    }[]
  >([]);
  protected chosenAnswer?: {
    word: WordCardModel;
    left: boolean;
  };
  protected wrongAnswer?: WordCardModel;
  private foundWords: WordCardModel[] = [];

  constructor() {
    effect(() => {
      if (this.wordSets().length < WORDS_SETS_LENGTH) {
        this.getWordsSet();
      }
    });
  }

  protected getTextColor() {
    if (!!this.wrongAnswer) {
      return 'danger';
    }
    if (!this.isGameDone()) {
      return 'dark';
    }
    return 'success';
  }

  protected handleRefresh() {
    this.resetQuestion();
  }

  protected handleMistakeDismiss() {
    this.wrongAnswer = undefined;
    this.chosenAnswer = undefined;
  }

  private resetQuestion() {
    this.chosenAnswer = undefined;
    this.wrongAnswer = undefined;
    this.foundWords = [];
    this.wordSets.update((sets) => sets.splice(1));
  }

  protected answeredClicked(word: WordCardModel, left: boolean) {
    if (!this.wordSets()[0]) {
      return;
    }
    if (
      word.id === this.chosenAnswer?.word?.id &&
      left === this.chosenAnswer?.left &&
      !this.isButtonFound(word)
    ) {
      this.chosenAnswer = undefined;
      return;
    }
    if (!this.chosenAnswer) {
      this.chosenAnswer = {
        word,
        left,
      };
    } else if (left === this.chosenAnswer?.left) {
      this.chosenAnswer = {
        word,
        left,
      };
    } else if (left !== this.chosenAnswer?.left) {
      if (this.chosenAnswer?.word?.id === word?.id) {
        this.foundWords.push(word);
        this.wrongAnswer = undefined;
        this.chosenAnswer = undefined;
        this.handleStatisticsUpdateAnswerStatus(true);
      } else {
        this.wrongAnswer = word;
        this.handleStatisticsUpdateAnswerStatus(false);
      }
    }
  }

  protected handleStatisticsUpdateAnswerStatus(correct: boolean) {
    correct
      ? this.localStorageService.addMatchPageSuccess()
      : this.localStorageService.addMatchPageFailure();
  }

  protected isGameDone() {
    return this.foundWords.length === WORDS_NUMBER_IN_ROUND;
  }

  protected isButtonFound(word: WordCardModel) {
    return this.foundWords.some((found) => found.id === word.id);
  }

  private isButtonMistake(word: WordCardModel) {
    return this.wrongAnswer?.id === word.id;
  }

  protected gelatin(word: WordCardModel, left: boolean) {
    return (
      (this.isButtonMistake(word) && left !== this.chosenAnswer?.left) ||
      this.isButtonActiveChoice(word, left) ||
      this.isButtonFound(word)
    );
  }

  protected isButtonActiveChoice(word: WordCardModel, left: boolean) {
    return (
      word.id === this.chosenAnswer?.word?.id &&
      left === this.chosenAnswer?.left &&
      !this.isButtonFound(word)
    );
  }

  protected getButtonColor(word: WordCardModel, left: boolean) {
    if (!this.wordSets()[0]) {
      return;
    }
    if (this.isButtonMistake(word) && left !== this.chosenAnswer?.left) {
      return 'danger';
    } else if (this.isButtonActiveChoice(word, left)) {
      return this.wrongAnswer ? 'danger' : 'warning';
    } else if (this.isButtonFound(word)) {
      return 'success';
    }
    return 'dark';
  }

  private getWordsSet() {
    this.gsApiService
      .getRandomWords([], WORDS_NUMBER_IN_ROUND)
      .pipe(
        map((words) => {
          return {
            left: this.utilityService.shuffleArray(words),
            right: this.utilityService.shuffleArray(words),
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
}
