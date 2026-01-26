import { Component, inject, OnInit, output } from '@angular/core';
import {
  IonActionSheet,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonToast,
} from '@ionic/angular/standalone';
import type { OverlayEventDetail } from '@ionic/core';
import { LocalStorageKeysEnum } from '../../../utils/constants/global.constants';
import { LocalStorageService } from '../../../services/local-storage-service/local-storage.service';

@Component({
  selector: 'app-clear-statistics',
  templateUrl: './clear-statistics.component.html',
  styleUrls: ['./clear-statistics.component.scss'],
  imports: [IonList, IonItem, IonLabel, IonButton, IonActionSheet, IonToast],
})
export class ClearStatisticsComponent {
  protected readonly dataCleared = output<boolean>();
  private readonly localStorageService = inject(LocalStorageService);
  private activeLocalStorageKey: LocalStorageKeysEnum =
    LocalStorageKeysEnum.SearchPage;
  protected isActionSheetOpen = false;
  protected isToastOpen = false;
  protected actionSheetButtons = [
    {
      text: 'Yes, Delete It!',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'No, I changed my Mind!',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  protected dismissedActionSheet(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.data.action === 'delete') {
      this.localStorageService.removeItem(this.activeLocalStorageKey);
      this.isToastOpen = true;
      this.isActionSheetOpen = false;
      console.log('emitted');
      this.dataCleared.emit(true);
    }
  }

  protected setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  protected setOpen(isOpen: boolean, localStorageKey: LocalStorageKeysEnum) {
    this.isActionSheetOpen = isOpen;
    this.activeLocalStorageKey = localStorageKey;
  }

  protected readonly LocalStorageKeysEnum = LocalStorageKeysEnum;
}
