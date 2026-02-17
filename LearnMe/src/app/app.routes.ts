import { Routes } from '@angular/router';
import { mistakesGuard } from './utils/guards/mistakes-guard/mistakes-guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'mistakes',
    canActivate: [mistakesGuard],
    loadComponent: () =>
      import('./mistakes.page/mistakes.page').then((m) => m.MistakesPage),
  },
];
