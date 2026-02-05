import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'swiper',
        loadComponent: () =>
          import('../swiper-tab/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'articles',
        loadComponent: () =>
          import('../articles-tab/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('../search-tab/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'statistics',
        loadComponent: () =>
          import('../statistics-tab/statistics-tab.page').then(
            (m) => m.StatisticsTabPage,
          ),
      },
      {
        path: 'home-page',
        loadComponent: () =>
          import('../home.page/home.page').then((m) => m.HomePage),
      },
      {
        path: 'matching',
        loadComponent: () =>
          import('../matching-tab.page/matching-tab.page').then(
            (m) => m.MatchingTabPage,
          ),
      },
      {
        path: 'translations',
        loadComponent: () =>
          import('../translations-tab.page/translations-tab.page').then(
            (m) => m.TranslationsTabPage,
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/home-page',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home-page',
    pathMatch: 'full',
  },
];
