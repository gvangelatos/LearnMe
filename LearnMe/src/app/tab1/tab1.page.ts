import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { Gesture, GestureController, Platform } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { SWIPE_THRESSHOLD, WORD_CARDS } from './tab1.constants';
import { WordCardModel } from './tab1.models';
import { GsApiService } from '../services/gs-api/gs-api.service';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { take } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
  ],
})
export class Tab1Page implements AfterViewInit {
  @ViewChildren(IonCard, { read: ElementRef })
  cards!: QueryList<ElementRef>;
  private readonly gestureCtrl = inject(GestureController);
  private readonly platform = inject(Platform);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly gsApiService = inject(GsApiService);
  protected wordCards = signal<WordCardModel[]>([]);

  constructor() {
    addIcons({ checkmarkCircleOutline, closeCircleOutline });
  }

  ngAfterViewInit() {
    this.gsApiService
      .getRandomWords()
      .pipe(take(1))
      .subscribe((wordsData) => {
        this.wordCards.set([]);
        wordsData.forEach(
          (word: {
            id: any;
            article: any;
            english_translation: any;
            german_translation: any;
            isPlural: any;
          }) => {
            this.wordCards.update((prevValue) => {
              prevValue.push({
                id: word.id,
                isUnknown: false,
                isSwipeRight: false,
                isSwipeLeft: false,
                article: word.article,
                english_translation: word.english_translation,
                german_translation: word.german_translation,
                isPlural: word.isPlural,
              });
              return prevValue;
            });
          },
        );
        this.cdr.detectChanges();
        const wordCards = this.cards.toArray();
        this.useSwipeGesture(wordCards);
      });
  }

  useSwipeGesture(cardsArray: ElementRef<any>[]) {
    cardsArray.forEach((card) => {
      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        onStart: () => {},
        onMove: (detail) => {
          card.nativeElement.style.transform = `translateX(${detail.deltaX}px) rotate(${detail.deltaX / 10}deg)`;
          if (detail.deltaX > SWIPE_THRESSHOLD) {
            this.setWordData(card.nativeElement.id, true, false);
          } else if (detail.deltaX < -SWIPE_THRESSHOLD) {
            this.setWordData(card.nativeElement.id, false, true);
          } else {
            this.setWordData(card.nativeElement.id, false, false);
          }
        },
        onEnd: (detail) => {
          card.nativeElement.style.transition = '.5s ease-out';
          this.setWordData(card.nativeElement.id, false, false);
          if (detail.deltaX > SWIPE_THRESSHOLD) {
            card.nativeElement.style.transform = `translateX(${+this.platform.width() * 2}px) rotate(${detail.deltaX / 2}deg)`;
            this.removeSuccessWordCard(card.nativeElement.id, gesture);
          } else if (detail.deltaX < -SWIPE_THRESSHOLD) {
            card.nativeElement.style.transform = '';
            this.setWordData(card.nativeElement.id, undefined, undefined, true);
          } else {
            card.nativeElement.style.transform = '';
          }
          this.cdr.detectChanges();
        },
        gestureName: 'swipe',
      });
      gesture.enable(true);
    });
    this.cdr.detectChanges();
  }

  removeSuccessWordCard(id: string, gesture: Gesture) {
    setTimeout(() => {
      this.wordCards.update((prevValue) => {
        return prevValue.filter((x) => x.id + '' !== id + '');
      });
      gesture.destroy();
      this.checkForLowNumberOfWordsInArray();
    }, 600);
  }

  checkForLowNumberOfWordsInArray() {
    if (this.wordCards().length < 3) {
      this.gsApiService
        .getRandomWords(this.wordCards().map((x) => +x.id))
        .pipe(take(1))
        .subscribe((wordsData) => {
          wordsData.forEach(
            (word: {
              id: any;
              article: any;
              english_translation: any;
              german_translation: any;
              isPlural: any;
            }) => {
              this.wordCards.update((prevValue) => {
                prevValue.unshift({
                  id: word.id,
                  isUnknown: false,
                  isSwipeRight: false,
                  isSwipeLeft: false,
                  article: word.article,
                  english_translation: word.english_translation,
                  german_translation: word.german_translation,
                  isPlural: word.isPlural,
                });
                return prevValue;
              });
            },
          );
          this.cdr.detectChanges();
          const wordCards = this.cards.toArray();
          this.useSwipeGesture(wordCards);
        });
    }
  }

  setWordData(
    id: string,
    swipeRight?: boolean,
    swipeLeft?: boolean,
    isUnknown?: boolean,
  ) {
    this.wordCards.update((cards) =>
      cards.map((word) => {
        if (word.id + '' !== id + '') {
          return word;
        }

        return {
          ...word,
          isSwipeRight: swipeRight ?? word.isSwipeRight,
          isSwipeLeft: swipeLeft ?? word.isSwipeLeft,
          isUnknown: isUnknown ?? word.isUnknown,
        };
      }),
    );
  }
}
