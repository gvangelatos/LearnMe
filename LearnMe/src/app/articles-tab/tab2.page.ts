import { Component, effect, inject, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner,
  IonLabel,
  IonIcon,
  IonText,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { GsApiService } from '../services/gs-api/gs-api.service';
import { WordCardModel } from '../swiper-tab/tab1.models';
import { ARTICLES } from './articles-page.constants';
import { addIcons } from 'ionicons';
import { languageOutline, arrowForwardOutline } from 'ionicons/icons';
import { NgClass } from '@angular/common';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';

@Component({
  selector: 'app-articles-tab',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonSpinner,
    IonLabel,
    IonIcon,
    NgClass,
    IonText,
    IonRefresher,
    IonRefresherContent,
  ],
})
export class Tab2Page {
  private readonly gsApiService = inject(GsApiService);
  private readonly localStorageService = inject(LocalStorageService);
  protected words = signal<WordCardModel[]>([]);
  protected isCorrect: boolean = false;
  protected answered: boolean = false;
  protected chosenAnswer?: number;
  protected correctAnswer?: number;
  protected showTranslation: boolean = false;

  constructor() {
    addIcons({ languageOutline, arrowForwardOutline });
    effect(() => {
      if (this.words().length < 3) {
        this.makeWordCall();
      }
    });
  }

  private makeWordCall() {
    this.gsApiService.getRandomWordsWithArticle(10).subscribe({
      next: (words) => {
        this.words.update((oldWords) => oldWords.concat(words));
        this.setCorrectWord();
      },
      error: (err) => {},
    });
  }

  private setCorrectWord() {
    if (this.words()[0]?.isPlural) {
      this.correctAnswer = 3;
    } else {
      const articles_single = ARTICLES.filter(
        (x) => !x.toLowerCase().includes('plural'),
      );
      const index = articles_single.findIndex((x) =>
        this.words()[0]?.article?.toLowerCase().includes(x.toLowerCase()),
      );
      if (index > -1) {
        this.correctAnswer = index;
      }
    }
  }

  protected answeredClicked(article: string, index: number) {
    if (!this.words()[0] || this.answered) {
      return;
    }
    this.chosenAnswer = index;
    if (article.toLowerCase().includes('plural') && this.words()[0].isPlural) {
      this.handleAnswer(true);
    } else if (
      this.words()[0].article?.toLowerCase().includes(article.toLowerCase())
    ) {
      this.handleAnswer(true);
    } else {
      this.handleAnswer(false);
    }
  }

  protected toggleTranslationShow() {
    this.showTranslation = !this.showTranslation;
  }

  private handleAnswer(correct: boolean) {
    correct
      ? this.localStorageService.addArticlesPageSuccess()
      : this.localStorageService.addArticlesPageFailure();
    this.isCorrect = correct;
    this.answered = true;
    this.showTranslation = true;
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

  private resetQuestion() {
    this.showTranslation = false;
    this.isCorrect = false;
    this.answered = false;
    this.correctAnswer = undefined;
    this.chosenAnswer = undefined;
    this.words.update((words) => words.slice(1));
    this.setCorrectWord();
  }

  protected readonly ARTICLES = ARTICLES;

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

  protected handleRefresh() {
    this.resetQuestion();
  }
}
