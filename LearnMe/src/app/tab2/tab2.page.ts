import { Component, inject } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { GsApiService } from '../services/gs-api/gs-api.service';
import { WordCardModel } from '../tab1/tab1.models';
import { ARTICLES } from './articles-page.constants';
import { addIcons } from 'ionicons';
import { languageOutline } from 'ionicons/icons';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tab2',
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
  ],
})
export class Tab2Page {
  private readonly gsApiService = inject(GsApiService);
  protected word?: WordCardModel;
  protected isCorrect: boolean = false;
  protected answered: boolean = false;
  protected isLoading: boolean = false;
  protected chosenAnswer?: number;
  protected correctAnswer?: number;
  protected showTranslation: boolean = false;

  constructor() {
    addIcons({ languageOutline });
    this.isLoading = true;
    this.gsApiService.getRandomWordWithArticle().subscribe((x) => {
      if (x.length) {
        this.word = x[0];
        this.setCorrectWord();
      }
      this.isLoading = false;
    });
  }

  private setCorrectWord() {
    if (this.word?.isPlural) {
      this.correctAnswer = 3;
    } else {
      const articles_single = ARTICLES.filter(
        (x) => !x.toLowerCase().includes('plural'),
      );
      const index = articles_single.findIndex((x) =>
        this.word?.article?.toLowerCase().includes(x.toLowerCase()),
      );
      if (index > -1) {
        this.correctAnswer = index;
      }
    }
  }

  protected answeredClicked(article: string, index: number) {
    if (!this.word || this.answered) {
      return;
    }
    this.chosenAnswer = index;
    if (article.toLowerCase().includes('plural') && this.word.isPlural) {
      this.handleAnswer(true);
    } else if (
      this.word.article?.toLowerCase().includes(article.toLowerCase())
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
    this.isCorrect = false;
    this.answered = false;
    this.correctAnswer = undefined;
    this.chosenAnswer = undefined;
    this.showTranslation = false;
    this.word = undefined;
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
}
