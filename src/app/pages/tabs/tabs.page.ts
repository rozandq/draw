import { Component } from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  nbFriendReq = 0;
  constructor(
      private cookieService: CookieService,
      private router: Router
  ) {
    console.log(this.cookieService.get('connected'));
    if (this.cookieService.get('connected') === 'false') {
        this.router.navigateByUrl('login');
    }
    this.initNbFriendReq();
  }
   initNbFriendReq() {
    firebase.firestore().collection('friend_request').where('uid', '==', firebase.auth().currentUser.uid).onSnapshot(
    snapshot => {
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }
    this.nbFriendReq = snapshot.size;
    /* snapshot.forEach(doc => {
      firebase.firestore().doc(`/friend_request/${doc.id}`).delete().catch(
        err => {
          console.log('Error deleting document', err);
        }
      );
    }); */
    }
    );
  }
}
