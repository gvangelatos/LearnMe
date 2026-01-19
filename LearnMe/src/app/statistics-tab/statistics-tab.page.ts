import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-statistics-tab',
  templateUrl: './statistics-tab.page.html',
  styleUrls: ['./statistics-tab.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar],
})
export class StatisticsTabPage {
  constructor() {}
}
