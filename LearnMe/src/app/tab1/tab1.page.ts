import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { GestureController, Platform } from '@ionic/angular';
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
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { WordCardModel } from './tab1.models';

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
  protected wordCards: WordCardModel[] = WORD_CARDS;

  constructor() {
    addIcons({ checkmarkCircleOutline, closeCircleOutline });
  }

  ngAfterViewInit() {
    const wordCards = this.cards.toArray();
    console.log(wordCards);
    this.useSwipeGesture(wordCards);
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
          this.cdr.detectChanges();
        },
        onEnd: (detail) => {
          card.nativeElement.style.transition = '.5s ease-out';
          this.setWordData(card.nativeElement.id, false, false);
          if (detail.deltaX > SWIPE_THRESSHOLD) {
            card.nativeElement.style.transform = `translateX(${+this.platform.width() * 2}px) rotate(${detail.deltaX / 2}deg)`;
            setTimeout(() => {
              this.wordCards.filter((x) => x.id !== card.nativeElement.id);
            }, 800);
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
  }

  setWordData(
    id: string,
    swipeRight?: boolean,
    swipeLeft?: boolean,
    isUnknown?: boolean,
  ) {
    const word = this.wordCards.find((x) => x.id === id);
    if (word) {
      word.isSwipeRight = swipeRight ?? word.isSwipeRight;
      word.isSwipeLeft = swipeLeft ?? word.isSwipeLeft;
      word.isUnknown = isUnknown ?? word.isUnknown;
    }
  }

  protected readonly WORD_CARDS = WORD_CARDS;
}
