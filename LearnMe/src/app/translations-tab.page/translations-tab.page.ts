import { Component, inject, signal } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { GsApiService } from '../services/gs-api/gs-api.service';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';
import { WordCardModel } from '../tab1/tab1.models';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, languageOutline } from 'ionicons/icons';
import { take } from 'rxjs';
import { TitleCasePipe } from '@angular/common';
import { UtilityService } from '../services/utility/utility.service';

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
    IonIcon,
  ],
})
export class TranslationsTabPage {
  private readonly gsApiService = inject(GsApiService);
  private readonly utilityService = inject(UtilityService);
  private readonly localStorageService = inject(LocalStorageService);
  protected word?: WordCardModel;
  protected isCorrect: boolean = false;
  protected answered: boolean = false;
  protected isLoading: boolean = false;
  protected chosenAnswer?: number;
  protected correctAnswer?: number;
  protected wordCards = signal<WordCardModel[]>([]);
  protected readonly answers = signal<string[]>([]);

  constructor() {
    addIcons({ languageOutline, arrowForwardOutline });
    this.isLoading = true;
    this.makeWordCall();
  }

  private makeWordCall() {
    this.gsApiService
      .getRandomWords(
        this.wordCards().map((x) => +x.id),
        4,
      )
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.answers.set(
            this.utilityService.shuffleArray(
              result.map((x) => x.english_translation),
            ),
          );

          this.isLoading = false;
          if (result.length) {
            this.word = result[0];
            this.correctAnswer = this.answers().findIndex(
              (answer) =>
                answer.toLowerCase() ===
                this.word?.english_translation?.toLowerCase(),
            );
          }
        },
        error: (error) => {
          this.isLoading = false;
        },
      });
  }

  private resetQuestion() {
    this.isCorrect = false;
    this.answered = false;
    this.correctAnswer = undefined;
    this.chosenAnswer = undefined;
    this.word = undefined;
    this.answers.set([]);
    this.wordCards.set([]);
  }

  protected answeredClicked(answer: string, index: number) {
    if (!this.word || this.answered) {
      return;
    }
    this.chosenAnswer = index;
    if (
      answer.toLowerCase() === this.word?.english_translation?.toLowerCase()
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
    if (!this.answered) {
      return 'dark';
    }
    if (index === this.correctAnswer) {
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
    this.makeWordCall();
  }
}
