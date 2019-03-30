import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/user/auth.guard';

const routes: Routes = [
  /* {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }, */
  {
    path: '',
    loadChildren: './pages/tabs/tabs.module#TabsPageModule',
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule'
  },
  {
    path: 'profile',
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'reset-password',
    loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule'
  },
  {
    path: 'signup',
    loadChildren: './pages/signup/signup.module#SignupPageModule'
  },
  { path: 'add-friends', loadChildren: './pages/add-friends/add-friends.module#AddFriendsPageModule' },
  {
      path: 'scan',
      children: [
          {
              path: '',
              loadChildren: './pages/scan-page/scan-page.module#ScanPagePageModule'
          }
      ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
