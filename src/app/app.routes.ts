import type { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { moderatorGuard } from './core/guards/moderator.guard';
import { userGuard } from './core/guards/user.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'annonce/create',
    canActivate: [authGuard, userGuard],
    loadComponent: () => import('./features/annonce/annonce-create/annonce-create.component').then(m => m.AnnonceCreateComponent)
  },
  {
    path: 'annonce/:id',
    loadComponent: () => import('./features/annonce/annonce-detail/annonce-detail.component').then(m => m.AnnonceDetailComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'profile/annonces',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent)
  },
  {
    path: 'moderation',
    canActivate: [authGuard, moderatorGuard],
    loadComponent: () => import('./features/moderation/moderation.component').then(m => m.ModerationComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];