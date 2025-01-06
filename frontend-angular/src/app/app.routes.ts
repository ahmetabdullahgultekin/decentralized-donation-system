import {Routes} from '@angular/router';
import {MainPageComponent} from './pages/main-page/main-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent
    //loadComponent: () => import('./pages/main-page/main-page.component').then(m => m.MainPageComponent)
  },
  {
    path: 'details',
    loadComponent: () => import('./pages/donate-page/donate-page.component').then(m => m.DonatePageComponent)
  },
  {
    path: 'donate',
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
    path: 'organizations',
    loadComponent: () => import('./pages/organizations-page/organizations-page.component').then(m => m.OrganizationsPageComponent)
  },
  {
    path: 'organizations/:id',
    loadComponent: () => import('./pages/details-page/details-page.component').then(m => m.DetailsPageComponent)
  },
  {
    path: 'organizations/:id/donate',
    loadComponent: () => import('./pages/details-page/details-page.component').then(m => m.DetailsPageComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent),
    //canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin-page/admin-page.component').then(m => m.AdminPageComponent),
    //canActivate: [AuthGuard]
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./pages/sign-in-page/sign-in-page.component').then(m => m.SignInPageComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/sign-up-page/sign-up-page.component').then(m => m.SignUpPageComponent),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];
