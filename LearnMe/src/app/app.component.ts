import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LocalStorageKeysEnum } from './utils/constants/global.constants';
import { LocalStorageService } from './services/local-storage-service/local-storage.service';
import { DarkModeService } from './services/dark-mode/dark-mode.service';
import { HapticsService } from './services/haptics/haptics.service';
import { AffirmationToastService } from './services/affirmation-toast-service/affirmation-toast.service';
import { SharingService } from './services/sharing-service/sharing.service';
import { MistakesService } from './services/mistakes-service/mistakes.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private readonly hapticsService = inject(HapticsService);
  private readonly sharingService = inject(SharingService);
  private readonly mistakesService = inject(MistakesService);
  private readonly darkModeService = inject(DarkModeService);
  private readonly affirmationToastService = inject(AffirmationToastService);

  constructor() {
    this.darkModeService.initializeDarkMode();
    this.hapticsService.initializeHaptics();
    this.affirmationToastService.initializeToastMessages();
    this.sharingService.initializeSharing();
    this.mistakesService.initializeMistakes();
  }
}
