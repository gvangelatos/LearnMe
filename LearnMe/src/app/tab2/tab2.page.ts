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
  ],
})
export class Tab2Page {
  private readonly gsApiService = inject(GsApiService);
  protected word?: WordCardModel;
  protected isCorrect = false;
  protected answered = false;
  protected isLoading: boolean = false;
  protected showTranslation: boolean = false;

  constructor() {
    addIcons({ languageOutline });
    this.isLoading = true;
    this.gsApiService.getRandomWordWithArticle().subscribe((x) => {
      if (x.length) {
        this.word = x[0];
      }
      this.isLoading = false;
    });
  }

  protected answeredClicked(article: string) {
    console.log(article);
    if (!this.word) {
      return;
    }
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
  }

  private resetQuestion() {
    this.isCorrect = false;
    this.answered = false;
  }

  protected readonly ARTICLES = ARTICLES;
}
