import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonModal,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { WordCardModel } from '../swiper-tab/tab1.models';
import { GsApiService } from '../services/gs-api/gs-api.service';
import { UtilityService } from '../services/utility/utility.service';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';
import { map, take } from 'rxjs';
import { TitleCasePipe } from '@angular/common';
import { LocalStorageKeysEnum } from '../utils/constants/global.constants';
import { HapticsService } from '../services/haptics/haptics.service';
import { AffirmationToastService } from '../services/affirmation-toast-service/affirmation-toast.service';
const WORDS_SETS_LENGTH: number = 3;
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
    TitleCasePipe,
    IonModal,
    IonSkeletonText,
  ],
})
export class MatchingTabPage {
  private readonly gsApiService = inject(GsApiService);
  private readonly utilityService = inject(UtilityService);
  private readonly hapticsService = inject(HapticsService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly affirmationToastService = inject(AffirmationToastService);
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
  protected matchingPairs: number = 5;

  constructor() {
    this.getMatchingPairsStorageData();
    effect(() => {
      if (this.wordSets().length < WORDS_SETS_LENGTH) {
        this.getWordsSet();
      }
    });
  }

  ionViewWillEnter() {
    this.getMatchingPairsStorageData(true);
  }

  private getMatchingPairsStorageData(refreshIfChanged: boolean = false) {
    const matchingPairsStorageData = this.localStorageService.getItem<number>(
      LocalStorageKeysEnum.MatchPairs,
    );
    if (matchingPairsStorageData === null) {
      this.matchingPairs = 5;
      this.localStorageService.setItem(
        LocalStorageKeysEnum.MatchPairs,
        this.matchingPairs,
      );
    } else {
      if (refreshIfChanged && this.matchingPairs !== matchingPairsStorageData) {
        this.wordSets.set([]);
      }
      this.matchingPairs = matchingPairsStorageData;
    }
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

  protected handleRefresh(showToast: boolean = false) {
    if (showToast) {
      this.hapticsService.vibrateSuccess();
      this.affirmationToastService.showPositiveToast();
    }
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
        this.hapticsService.vibrateError();
        this.affirmationToastService.showNegativeToast();
      }
    }
  }

  protected handleStatisticsUpdateAnswerStatus(correct: boolean) {
    correct
      ? this.localStorageService.addMatchPageSuccess()
      : this.localStorageService.addMatchPageFailure();
  }

  protected isGameDone() {
    return this.foundWords.length === this.matchingPairs;
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
      .getRandomWords([], this.matchingPairs)
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
