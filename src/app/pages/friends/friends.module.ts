import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FriendsPage } from './friends.page';
import { AddFriendsComponent } from './add-friends/add-friends.component';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: FriendsPage }])
  ],
  declarations: [
    FriendsPage,
    AddFriendsComponent,
    FriendRequestsComponent
  ],
  entryComponents: [
      AddFriendsComponent,
      FriendRequestsComponent
  ]
})
export class FriendsPageModule {}
