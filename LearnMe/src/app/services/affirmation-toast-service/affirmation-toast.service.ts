import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  saveOutline,
  checkmarkCircleOutline,
  heartCircleOutline,
  heartOutline,
  flashOutline,
  happyOutline,
  diamondOutline,
  bulbOutline,
  balloonOutline,
  giftOutline,
  medalOutline,
  thumbsUpOutline,
  trendingUpOutline,
  ribbonOutline,
  starOutline,
  rocketOutline,
  alertCircleOutline,
  bandageOutline,
  closeCircleOutline,
  heartDislikeOutline,
  rainyOutline,
  skullOutline,
  sadOutline,
  thumbsDownOutline,
  thunderstormOutline,
  trendingDownOutline,
  warningOutline,
} from 'ionicons/icons';
import { LocalStorageService } from '../local-storage-service/local-storage.service';
import { LocalStorageKeysEnum } from '../../utils/constants/global.constants';
import { min } from 'rxjs';

const NEGATIVE_ICONS: string[] = [
  'alert-circle-outline',
  'bandage-outline',
  'close-circle-outline',
  'heart-dislike-outline',
  'rainy-outline',
  'skull-outline',
  'sad-outline',
  'thumbs-down-outline',
  'thunderstorm-outline',
  'trending-down-outline',
  'warning-outline',
];

const POSITIVE_ICONS: string[] = [
  'checkmark-circle-outline',
  'heart-circle-outline',
  'heart-outline',
  'flash-outline',
  'diamond-outline',
  'bulb-outline',
  'balloon-outline',
  'gift-outline',
  'medal-outline',
  'thumbs-up-outline',
  'trending-up-outline',
  'ribbon-outline',
  'rocket-outline',
  'happy-outline',
  'star-outline',
];

const POSITIVE_MESSAGES: string[] = [
  'Great job!',
  'Excellent!',
  'Perfect!',
  'Well done!',
  'Nice work!',
  "That's right!",
  'Correct!',
  'You got it!',
  'Awesome!',
  'Fantastic!',
  'Nailed it!',
  'Brilliant!',
  'Exactly right!',
  'Way to go!',
  'Outstanding!',
  'Boom! Nailed it!',
  "You're on fire!",
  'Look at you go!',
  'Crushing it!',
  'Big brain!',
  'Absolutely smashing it!',
  "Chef's kiss! *mwah*",
  '10/10 would answer again',
  "You're a legend!",
  "Somebody's been studying!",
  "Is there anything you don't know?",
  'Too easy for you!',
  'Making this look effortless!',
  "Are you even trying? (Because you're so good!)",
  'Gold star for you! ⭐',
  'Ding ding ding! Winner!',
  'Smooth operator!',
  "You're unstoppable!",
  "Show off! (kidding, you're great)",
  'Genius at work!',
  'Nothing gets past you!',
  'Sharp as a tack!',
  'Absolutely legendary!',
  'You make this look easy!',
  'Pro move right there!',
  'Built different!',
  'No notes, perfect!',
  "That's what I'm talking about!",
  'Flexing those brain muscles!',
  "Couldn't have said it better myself!",
  'Straight fire answer!',
];

const NEGATIVE_MESSAGES: string[] = [
  'Not quite, but nice try!',
  'Oops! Give it another shot!',
  'So close! Try again!',
  'Almost had it!',
  'Not this time, but keep going!',
  'Swing and a miss! Try again!',
  "Nope, but don't give up!",
  'Good effort! Want to try again?',
  "Not quite right, but you're learning!",
  'Whoops! Better luck next time!',
  'Close, but no cigar!',
  'Oof, not quite!',
  'Nice try though!',
  'Happens to the best of us!',
  'We all make mistakes!',
  "Plot twist: that wasn't it!",
  'Nah, but I like your confidence!',
  "Yikes! Let's try that again!",
  'Error 404: correct answer not found',
  'Houston, we have a problem!',
  'Task failed successfully!',
  'Better luck next round!',
  'Not even close, but A for effort!',
  'Bummer! Shake it off!',
  'Narrator: It was not correct.',
  'Big oof!',
  'Ctrl+Z that answer!',
  "That's a no from me, dawg",
  'Respectfully... no',
  "We'll pretend that didn't happen!",
  'Back to the drawing board!',
  'Swing and a miss, champ!',
  'The universe says nope!',
  'Not your finest moment, but we move!',
];

@Injectable({
  providedIn: 'root',
})
export class AffirmationToastService {
  private readonly toastController = inject(ToastController);
  private readonly localStorageService = inject(LocalStorageService);
  private _toastsEnabled: boolean = false;

  get toastsEnabled(): boolean {
    return this._toastsEnabled;
  }

  constructor() {
    addIcons({
      saveOutline,
      checkmarkCircleOutline,
      heartCircleOutline,
      heartOutline,
      flashOutline,
      happyOutline,
      diamondOutline,
      bulbOutline,
      balloonOutline,
      giftOutline,
      medalOutline,
      thumbsUpOutline,
      trendingUpOutline,
      ribbonOutline,
      starOutline,
      rocketOutline,
      alertCircleOutline,
      bandageOutline,
      closeCircleOutline,
      heartDislikeOutline,
      rainyOutline,
      skullOutline,
      sadOutline,
      thumbsDownOutline,
      thunderstormOutline,
      trendingDownOutline,
      warningOutline,
    });
  }

  toggleToasts(enabled: boolean) {
    this._toastsEnabled = enabled;
    this.localStorageService.setItem(
      LocalStorageKeysEnum.ToastMessages,
      enabled,
    );
  }

  initializeToastMessages() {
    let toastsEnabledLocalStorageData =
      this.localStorageService.getItem<boolean>(
        LocalStorageKeysEnum.ToastMessages,
      );
    if (toastsEnabledLocalStorageData === null) {
      this._toastsEnabled = false;
      this.localStorageService.setItem(
        LocalStorageKeysEnum.Haptics,
        this._toastsEnabled,
      );
    } else {
      this._toastsEnabled = toastsEnabledLocalStorageData;
    }
    return !!toastsEnabledLocalStorageData;
  }

  async presentToast(
    message: string,
    color: string = 'dark',
    icon?: string,
    position: 'top' | 'middle' | 'bottom' = 'top',
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 1000,
      position,
      color,
      icon,
      swipeGesture: 'vertical',
    });

    await toast.present();
  }

  showPositiveToast() {
    if (!this._toastsEnabled) {
      return;
    }
    const min = 0;
    const iconIndex =
      Math.floor(Math.random() * (POSITIVE_ICONS.length - 1)) + min;
    const messageIndex =
      Math.floor(Math.random() * (POSITIVE_MESSAGES.length - 1)) + min;
    this.presentToast(
      POSITIVE_MESSAGES[messageIndex],
      'success',
      POSITIVE_ICONS[iconIndex],
    );
  }

  showNegativeToast() {
    if (!this._toastsEnabled) {
      return;
    }
    const min = 0;
    const iconIndex =
      Math.floor(Math.random() * (NEGATIVE_ICONS.length - 1)) + min;
    const messageIndex =
      Math.floor(Math.random() * (NEGATIVE_MESSAGES.length - 1)) + min;
    this.presentToast(
      NEGATIVE_MESSAGES[messageIndex],
      'danger',
      NEGATIVE_ICONS[iconIndex],
    );
  }
}
