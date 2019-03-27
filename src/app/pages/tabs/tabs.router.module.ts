import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'user-profile',
        children: [
          {
            path: '',
            loadChildren: '../user-profile/user-profile.module#UserProfilePageModule'
          }
        ]
      },
      {
        path: 'friends',
        children: [
          {
            path: '',
            loadChildren: '../friends/friends.module#FriendsPageModule'
          }
        ]
      },
      {
        path: 'play',
        children: [
          {
            path: '',
            loadChildren: '../play/play.module#PlayPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/play',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/play',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
