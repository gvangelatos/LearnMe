import { CanActivateFn } from '@angular/router';
import { MistakesService } from '../../../services/mistakes-service/mistakes.service';
import { inject } from '@angular/core';
import { AffirmationToastService } from '../../../services/affirmation-toast-service/affirmation-toast.service';

export const mistakesGuard: CanActivateFn = (route, state) => {
  const mistakesService = inject(MistakesService);
  const numBerOfMistakes = mistakesService.initializeMistakes()?.length ?? 0;
  if (numBerOfMistakes <= 3) {
    const affirmationToastService = inject(AffirmationToastService);
    affirmationToastService.presentToast(
      'Hmmm.. Make some mistakes first!',
      'dark',
      'bulb-outline',
    );
  }
  return numBerOfMistakes > 3;
};
