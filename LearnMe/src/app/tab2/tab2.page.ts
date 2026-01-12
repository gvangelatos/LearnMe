import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';
import { GsApiService } from '../services/gs-api/gs-api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class Tab2Page {
  private readonly gsApiService = inject(GsApiService);
  constructor() {
    this.gsApiService
      .getRandomWordWithArticle()
      .subscribe((x) => console.log(x));
  }
}
