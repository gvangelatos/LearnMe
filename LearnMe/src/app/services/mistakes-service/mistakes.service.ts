import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage-service/local-storage.service';
import { WordCardModel } from '../../swiper-tab/tab1.models';
import { LocalStorageKeysEnum } from '../../utils/constants/global.constants';

const MAX_OFTEN_MADE_MISTAKES_LIST_LENGTH: number = 10;

interface Mistake {
  wordID: string;
  times: number;
}

@Injectable({
  providedIn: 'root',
})
export class MistakesService {
  private readonly localStorageService = inject(LocalStorageService);
  private _oftenMadeMistakesList: Mistake[] = [];

  get oftenMadeMistakesList(): Mistake[] {
    return this._oftenMadeMistakesList;
  }

  initializeSharing() {
    let oftenMadeMistakesListLocalStorageData =
      this.localStorageService.getItem<Mistake[]>(
        LocalStorageKeysEnum.OftenMadeMistakes,
      );
    if (oftenMadeMistakesListLocalStorageData === null) {
      this._oftenMadeMistakesList = [];
      this.localStorageService.setItem(
        LocalStorageKeysEnum.OftenMadeMistakes,
        this._oftenMadeMistakesList,
      );
    } else {
      this._oftenMadeMistakesList = oftenMadeMistakesListLocalStorageData;
    }
    return oftenMadeMistakesListLocalStorageData;
  }

  addMistake(wordID: string) {
    if (this.isMistakeAlreadyMade(wordID)) {
      this._oftenMadeMistakesList = [
        ...this._oftenMadeMistakesList.map((mistake: Mistake) => {
          if (mistake.wordID === wordID) {
            mistake.times++;
          }
          return mistake;
        }),
      ];
    } else {
      this._oftenMadeMistakesList.push({
        wordID,
        times: 1,
      });
    }
    this.localStorageService.setItem(
      LocalStorageKeysEnum.OftenMadeMistakes,
      this._oftenMadeMistakesList,
    );
  }

  private isMistakeAlreadyMade(wordID: string) {
    return this._oftenMadeMistakesList.some((mist) => mist.wordID === wordID);
  }
}
