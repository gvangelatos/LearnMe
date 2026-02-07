import { inject, Injectable } from '@angular/core';
import domtoimage from 'dom-to-image';
import { LocalStorageService } from '../local-storage-service/local-storage.service';
import { LocalStorageKeysEnum } from '../../utils/constants/global.constants';

@Injectable({
  providedIn: 'root',
})
export class SharingService {
  private readonly localStorageService = inject(LocalStorageService);
  private _isSharingEnabled = false;

  initializeSharing() {
    let haringEnabledLocalStorageData =
      this.localStorageService.getItem<boolean>(LocalStorageKeysEnum.Sharing);
    if (haringEnabledLocalStorageData === null) {
      this._isSharingEnabled = false;
      this.localStorageService.setItem(
        LocalStorageKeysEnum.Sharing,
        this._isSharingEnabled,
      );
    } else {
      this._isSharingEnabled = haringEnabledLocalStorageData;
    }
    return !!haringEnabledLocalStorageData;
  }

  toggleSharing(enabled: boolean) {
    this._isSharingEnabled = enabled;
    this.localStorageService.setItem(LocalStorageKeysEnum.Sharing, enabled);
  }

  async shareGraphs(
    elementId: string,
    text: string,
    fileName: string = 'LearnMe',
  ) {
    try {
      // Get the div element
      const element = document.getElementById(elementId);
      if (!element) return;

      // Convert to blob
      const blob = await domtoimage.toBlob(element, {
        width: element.offsetWidth * 2,
        height: element.offsetHeight * 2,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left',
        },
      });

      const file = new File([blob], fileName + '.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName + '.png',
          text,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }
}
