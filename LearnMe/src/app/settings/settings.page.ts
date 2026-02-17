import { Component, inject } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonRange,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { LocalStorageKeysEnum } from '../utils/constants/global.constants';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';
import { FormsModule } from '@angular/forms';
import { DarkModeService } from '../services/dark-mode/dark-mode.service';
import { HapticsService } from '../services/haptics/haptics.service';
import { AffirmationToastService } from '../services/affirmation-toast-service/affirmation-toast.service';
import { addIcons } from 'ionicons';
import {
  saveOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  heartCircleOutline,
  heartOutline,
  flashOutline,
  diamondOutline,
  bulbOutline,
  balloonOutline,
  giftOutline,
  medalOutline,
  thumbsUpOutline,
  trendingUpOutline,
  ribbonOutline,
  rocketOutline,
} from 'ionicons/icons';
import { SharingService } from '../services/sharing-service/sharing.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonItem,
    IonList,
    IonToggle,
    FormsModule,
    IonRange,
  ],
})
export class SettingsPage {
  private readonly sharingService = inject(SharingService);
  private readonly hapticsService = inject(HapticsService);
  private readonly darkModeService = inject(DarkModeService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly affirmationToastService = inject(AffirmationToastService);
  protected germanEnabled: boolean = false;
  protected matchingPairs: number = 5;
  protected paletteToggle = false;
  protected hapticsToggle = false;
  protected toastsToggle = false;
  protected sharingToggle = false;

  constructor() {
    this.getIsGermanEnabledStorageData();
    this.getMatchingPairsStorageData();
    this.paletteToggle = this.darkModeService.initializeDarkMode();
    this.sharingToggle = this.sharingService.initializeSharing();
    this.hapticsToggle = this.hapticsService.initializeHaptics();
    this.toastsToggle = this.affirmationToastService.initializeToastMessages();
  }

  protected vibrate() {
    this.hapticsService.vibrateDefault();
  }

  protected toggleChange(event: CustomEvent) {
    this.darkModeService.toggleDarkPalette(event.detail.checked);
    this.hapticsService.vibrateDefault();
    this.affirmationToastService.presentToast(
      'Settings Saved!',
      'success',
      'save-outline',
      'bottom',
    );
  }

  protected toggleHaptics(event: CustomEvent) {
    this.hapticsService.toggleHaptics(event.detail.checked);
    this.hapticsService.vibrateDefault();
    this.affirmationToastService.presentToast(
      'Settings Saved!',
      'success',
      'save-outline',
      'bottom',
    );
  }

  protected toggleSharing(event: CustomEvent) {
    this.sharingService.toggleSharing(event.detail.checked);
    this.hapticsService.vibrateDefault();
    this.affirmationToastService.presentToast(
      'Settings Saved!',
      'success',
      'save-outline',
      'bottom',
    );
  }

  protected toggleToasts(event: CustomEvent) {
    this.affirmationToastService.toggleToasts(event.detail.checked);
    this.hapticsService.vibrateDefault();
    this.affirmationToastService.presentToast(
      'Settings Saved!',
      'success',
      'save-outline',
      'bottom',
    );
  }

  protected rangeChanged(event: { target: { value: any } }) {
    this.localStorageService.setItem(
      LocalStorageKeysEnum.MatchPairs,
      event?.target.value,
    );
    this.hapticsService.vibrateDefault();
    this.affirmationToastService.presentToast(
      'Settings Saved!',
      'success',
      'save-outline',
      'bottom',
    );
  }

  private getMatchingPairsStorageData() {
    const matchingPairsStorageData = this.localStorageService.getItem<number>(
      LocalStorageKeysEnum.MatchPairs,
    );
    if (matchingPairsStorageData === null) {
      this.matchingPairs = 5;
      this.localStorageService.setItem(
        LocalStorageKeysEnum.MatchPairs,
        this.matchingPairs,
      );
    } else {
      this.matchingPairs = matchingPairsStorageData;
    }
  }

  private getIsGermanEnabledStorageData() {
    const isGermanEnabledStorageData =
      this.localStorageService.getItem<boolean>(
        LocalStorageKeysEnum.GermanEnabled,
      );
    if (isGermanEnabledStorageData === null) {
      this.germanEnabled = false;
      this.localStorageService.setItem(
        LocalStorageKeysEnum.GermanEnabled,
        false,
      );
    } else {
      this.germanEnabled = isGermanEnabledStorageData;
    }
  }

  protected toggleGerman(event: { detail: { checked: boolean } }) {
    this.localStorageService.setItem(
      LocalStorageKeysEnum.GermanEnabled,
      event?.detail?.checked,
    );
    this.hapticsService.vibrateDefault();
    this.affirmationToastService.presentToast(
      'Settings Saved!',
      'success',
      'save-outline',
      'bottom',
    );
  }
}
