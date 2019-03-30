import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FriendsPage } from './friends.page';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
import {QRScanner} from '@ionic-native/qr-scanner/ngx';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: FriendsPage }])
  ],
  declarations: [
    FriendsPage,
    FriendRequestsComponent
  ],
  entryComponents: [
      FriendRequestsComponent
  ],
  providers: [
      QRScanner
  ]
})
export class FriendsPageModule {}
