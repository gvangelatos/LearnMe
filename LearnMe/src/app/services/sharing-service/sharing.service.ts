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

  get isSharingEnabled(): boolean {
    return this._isSharingEnabled;
  }

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

  async shareElement(
    elementId: string,
    text: string,
    fileName: string = 'LearnMe',
  ) {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        console.log('Element not found: ' + elementId);
        return;
      }

      if (element.offsetWidth === 0 || element.offsetHeight === 0) {
        console.log('Element has no dimensions');
        return;
      }

      const dataUrl = await domtoimage.toPng(element, {
        quality: 1,
        cacheBust: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        console.log('Failed to create blob');
        return;
      }

      const file = new File([blob], `${fileName}.png`, {
        type: 'image/png',
        lastModified: Date.now(),
      });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${fileName}.png`,
          text,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    } catch (error) {
      console.error('Error sharing: ' + error);
    }
  }
}
