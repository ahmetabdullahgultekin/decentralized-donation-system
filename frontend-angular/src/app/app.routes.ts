import {Routes} from '@angular/router';
import {MainPageComponent} from './pages/main-page/main-page.component';

export const routes: Routes = [
  {path: '', component: MainPageComponent},
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
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard-page/dashboard-page.component').then(m => m.DashboardPageComponent)
  },
  {
    path: 'test',
    loadComponent: () => import('./pages/test-page/test-page.component').then(m => m.TestPageComponent)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];
