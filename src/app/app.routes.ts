import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Account } from './components/account/account';
import { MainLayout } from './main-layout/main-layout';
import { authGuard } from './guards/auth-guard';
import { Past } from './components/past/past';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      { path: 'past', component: Past },
      {
        path: 'account',
        component: Account
      }
      
    ]
  }
];