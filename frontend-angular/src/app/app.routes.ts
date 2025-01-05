import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/main-page/main-page.component').then(m => m.MainPageComponent)
  },
  {
    path: 'donate',
    loadComponent: () => import('./pages/donate-page/donate-page.component').then(m => m.DonatePageComponent)
  },
  {
    path: 'details',
    loadComponent: () => import('./pages/details-page/details-page.component').then(m => m.DetailsPageComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about-page/about-page.component').then(m => m.AboutPageComponent)
  },
  {
    path: 'test',
    loadComponent: () => import('./pages/test-page/test-page.component').then(m => m.TestPageComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin-page/admin-page.component').then(m => m.AdminPageComponent)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];
