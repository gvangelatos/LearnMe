import {AfterViewInit, Component, ElementRef, inject, ViewChild} from '@angular/core';
import {Gesture, GestureController, Platform} from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent
} from '@ionic/angular/standalone';
import {ExploreContainerComponent} from '../explore-container/explore-container.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent],
})
export class Tab1Page implements AfterViewInit {
  @ViewChild(IonCard, {read: ElementRef}) card!: ElementRef<HTMLIonCardElement>;
  private readonly gestureCtrl = inject(GestureController);
  private readonly platform = inject(Platform)

  ngAfterViewInit() {
    const gesture = this.gestureCtrl.create({
      el: this.card.nativeElement,
      onStart: () => {
      },
      onMove: (detail) => {
        this.card.nativeElement.style.transform = `translateX(${detail.deltaX}px) rotate(${detail.deltaX / 10}deg)`
      },
      onEnd: (detail) => {
        this.card.nativeElement.style.transition = '.5s ease-out';
        if (detail.deltaX > 150) {
          this.card.nativeElement.style.transform = `translateX(${+this.platform.width() * 2}px) rotate(${detail.deltaX / 2}deg)`
        } else if (detail.deltaX < 150) {
          this.card.nativeElement.style.transform = '';
        } else {
          this.card.nativeElement.style.transform = '';
        }
      },
      gestureName: 'swipe',
    });

    gesture.enable();
  }
}
