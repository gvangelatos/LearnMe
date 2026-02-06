import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage-service/local-storage.service';
import { LocalStorageKeysEnum } from '../../utils/constants/global.constants';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private readonly localStorageService = inject(LocalStorageService);

  initializeDarkMode() {
    let darkModeEnabledLocalStorageData =
      this.localStorageService.getItem<boolean>(LocalStorageKeysEnum.DarkMode);
    if (darkModeEnabledLocalStorageData === null) {
      darkModeEnabledLocalStorageData = window.matchMedia(
        '(prefers-color-scheme: dark)',
      )?.matches;
      this.localStorageService.setItem(
        LocalStorageKeysEnum.DarkMode,
        darkModeEnabledLocalStorageData,
      );
    }
    this.toggleDarkPalette(darkModeEnabledLocalStorageData);
    return darkModeEnabledLocalStorageData;
  }

  toggleDarkPalette(shouldAdd: boolean) {
    this.localStorageService.setItem(LocalStorageKeysEnum.DarkMode, shouldAdd);
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }
}
