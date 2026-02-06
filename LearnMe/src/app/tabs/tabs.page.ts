import { Component, inject } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  square,
  grid,
  gridOutline,
  searchOutline,
  search,
  statsChartOutline,
  statsChart,
  language,
  languageOutline,
  shuffleOutline,
  shuffle,
  homeOutline,
  home,
} from 'ionicons/icons';
import { HapticsService } from '../services/haptics/haptics.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  private readonly hapticsService = inject(HapticsService);

  constructor() {
    addIcons({
      square,
      grid,
      gridOutline,
      searchOutline,
      search,
      statsChartOutline,
      statsChart,
      language,
      languageOutline,
      shuffleOutline,
      shuffle,
      homeOutline,
      home,
    });
  }

  protected cardClicked() {
    this.hapticsService.vibrateDefault();
  }
}
