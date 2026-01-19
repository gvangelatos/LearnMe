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
import { SWIPE_THRESHOLD } from './swipe-page.constants';
import { WordCardModel } from './tab1.models';
import { GsApiService } from '../services/gs-api/gs-api.service';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { take } from 'rxjs';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';

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
  private readonly localStorageService = inject(LocalStorageService);
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
            this.wordCards.update((prevValue) => [
              ...prevValue,
              {
                id: word.id,
                isUnknown: false,
                isSwipeRight: false,
                isSwipeLeft: false,
                article: word.article,
                english_translation: word.english_translation,
                german_translation: word.german_translation,
                isPlural: word.isPlural,
              },
            ]);
          },
        );
        this.cdr.detectChanges();
        this.useSwipeGesture(this.cards.toArray());
      });
  }

  private useSwipeGesture(cardsArray: ElementRef<any>[]) {
    cardsArray.forEach((card) => {
      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        onStart: () => {},
        onMove: (detail) => {
          card.nativeElement.style.transform = `translateX(${detail.deltaX}px) rotate(${detail.deltaX / 10}deg)`;
          if (detail.deltaX > SWIPE_THRESHOLD) {
            this.setWordData(card.nativeElement.id, true, false);
          } else if (detail.deltaX < -SWIPE_THRESHOLD) {
            this.setWordData(card.nativeElement.id, false, true);
          } else {
            this.setWordData(card.nativeElement.id, false, false);
          }
        },
        onEnd: (detail) => {
          card.nativeElement.style.transition = '.5s ease-out';
          this.setWordData(card.nativeElement.id, false, false);
          if (detail.deltaX > SWIPE_THRESHOLD) {
            card.nativeElement.style.transform = `translateX(${+this.platform.width() * 2}px) rotate(${detail.deltaX / 2}deg)`;
            this.removeSuccessWordCard(card.nativeElement.id, gesture);
            this.documentSuccess(card.nativeElement.id);
          } else if (detail.deltaX < -SWIPE_THRESHOLD) {
            card.nativeElement.style.transform = '';
            this.documentFailure(card.nativeElement.id);
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

  private removeSuccessWordCard(id: string, gesture: Gesture) {
    setTimeout(() => {
      this.wordCards.update((prevValue) => {
        return prevValue.filter((x) => x.id + '' !== id + '');
      });
      gesture.destroy();
      this.checkForLowNumberOfWordsInArray();
    }, 600);
  }

  private checkForLowNumberOfWordsInArray() {
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
              this.wordCards.update((prevValue) => [
                {
                  id: word.id,
                  isUnknown: false,
                  isSwipeRight: false,
                  isSwipeLeft: false,
                  article: word.article,
                  english_translation: word.english_translation,
                  german_translation: word.german_translation,
                  isPlural: word.isPlural,
                },
                ...prevValue,
              ]);
            },
          );
          this.cdr.detectChanges();
          this.useSwipeGesture(this.cards.toArray());
        });
    }
  }

  private setWordData(
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

  private documentSuccess(cardId: string) {
    if (
      this.wordCards().some((card) => {
        return card.id + '' === cardId && !card.isUnknown;
      })
    ) {
      this.localStorageService.addSwiperPageSuccess();
    }
  }

  private documentFailure(cardId: string) {
    if (
      this.wordCards().some((card) => {
        return card.id + '' === cardId && !card.isUnknown;
      })
    ) {
      this.localStorageService.addSwiperPageFailure();
    }
  }
}
