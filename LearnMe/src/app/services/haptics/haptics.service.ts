import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage-service/local-storage.service';
import { LocalStorageKeysEnum } from '../../utils/constants/global.constants';
import { haptic } from 'ios-haptics';

@Injectable({
  providedIn: 'root',
})
export class HapticsService {
  private readonly localStorageService = inject(LocalStorageService);
  private _areHapticsEnabled = false;

  get areHapticsEnabled(): boolean {
    return this._areHapticsEnabled;
  }

  initializeHaptics() {
    let hapticsEnabledLocalStorageData =
      this.localStorageService.getItem<boolean>(LocalStorageKeysEnum.Haptics);
    if (hapticsEnabledLocalStorageData === null) {
      this._areHapticsEnabled = false;
      this.localStorageService.setItem(
        LocalStorageKeysEnum.Haptics,
        this._areHapticsEnabled,
      );
    } else {
      this._areHapticsEnabled = hapticsEnabledLocalStorageData;
    }
    return !!hapticsEnabledLocalStorageData;
  }

  toggleHaptics(enabled: boolean) {
    this._areHapticsEnabled = enabled;
    this.localStorageService.setItem(LocalStorageKeysEnum.Haptics, enabled);
  }

  vibrateSuccess() {
    if (this._areHapticsEnabled) {
      haptic.error();
    }
  }

  vibrateError() {
    if (this._areHapticsEnabled) {
      haptic.confirm();
    }
  }

  vibrateDefault() {
    if (this._areHapticsEnabled) {
      haptic();
    }
  }
}
