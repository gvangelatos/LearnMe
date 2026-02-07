import { Component, effect, inject, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonText,
  IonRefresher,
  IonRefresherContent,
  IonModal,
  IonSkeletonText,
  IonFab,
  IonFabButton,
  IonFabList,
} from '@ionic/angular/standalone';
import { GsApiService } from '../services/gs-api/gs-api.service';
import { WordCardModel } from '../swiper-tab/tab1.models';
import { ARTICLES } from './articles-page.constants';
import { addIcons } from 'ionicons';
import {
  languageOutline,
  arrowForwardOutline,
  chevronDownCircleOutline,
  shareOutline,
} from 'ionicons/icons';
import { NgClass } from '@angular/common';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';
import { HapticsService } from '../services/haptics/haptics.service';
import { AffirmationToastService } from '../services/affirmation-toast-service/affirmation-toast.service';
import { SharingService } from '../services/sharing-service/sharing.service';

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
    IonIcon,
    NgClass,
    IonText,
    IonRefresher,
    IonRefresherContent,
    IonModal,
    IonSkeletonText,
    IonFab,
    IonFabButton,
    IonFabList,
  ],
})
export class Tab2Page {
  private readonly gsApiService = inject(GsApiService);
  private readonly hapticsService = inject(HapticsService);
  private readonly sharingService = inject(SharingService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly affirmationToastService = inject(AffirmationToastService);
  protected words = signal<WordCardModel[]>([]);
  protected isCorrect: boolean = false;
  protected answered: boolean = false;
  protected chosenAnswer?: number;
  protected correctAnswer?: number;
  protected showTranslation: boolean = false;
  protected chosen: boolean = false;
  protected sharingEnabled: boolean = false;

  constructor() {
    addIcons({
      languageOutline,
      arrowForwardOutline,
      chevronDownCircleOutline,
      shareOutline,
    });
    effect(() => {
      if (this.words().length < 3) {
        this.makeWordCall();
      }
    });
    this.sharingEnabled = this.sharingService.isSharingEnabled;
  }

  ionViewWillEnter() {
    this.sharingEnabled = this.sharingService.initializeSharing();
  }

  protected shareWord() {
    this.hapticsService.vibrateDefault();
    this.sharingService.shareElement(
      'share-this-articles',
      'Hey, take a look at this word!',
      this.words()[0].german_translation,
    );
  }

  private makeWordCall() {
    this.gsApiService.getRandomWordsWithArticle(5).subscribe({
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
    this.chosen = true;
  }

  protected checkAnswer() {
    if (!this.chosen) {
      return;
    }
    this.answered = true;
    if (
      typeof this.chosenAnswer === 'number' &&
      ARTICLES[this.chosenAnswer].toLowerCase().includes('plural') &&
      this.words()[0].isPlural
    ) {
      this.handleAnswer(true);
    } else if (
      typeof this.chosenAnswer === 'number' &&
      this.words()[0]
        .article?.toLowerCase()
        .includes(ARTICLES[this.chosenAnswer].toLowerCase()) &&
      !this.words()[0].isPlural
    ) {
      this.handleAnswer(true);
      this.hapticsService.vibrateSuccess();
      this.affirmationToastService.showPositiveToast();
    } else {
      this.handleAnswer(false);
      this.hapticsService.vibrateError();
      this.affirmationToastService.showNegativeToast();
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
    this.chosen = false;
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
    if (!this.answered && !this.chosen) {
      return 'dark';
    }
    if (this.chosen && !this.answered && index === this.chosenAnswer) {
      return 'warning';
    }
    if (index === this.correctAnswer && this.answered && this.chosen) {
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
