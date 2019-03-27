import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {AngularFireAuth} from '@angular/fire/auth';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: 'user-profile.page.html',
  styleUrls: ['user-profile.page.scss']
})
export class UserProfilePage {
  uid = '';
  name = '';
  email = '';
  creationDate = '';
  imgUrl = '';
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private cookieService: CookieService
  ) {
    this.uid = cookieService.get('uid');
    this.creationDate = afAuth.auth.currentUser.metadata.creationTime;
    this.name = afAuth.auth.currentUser.displayName;
    this.email = afAuth.auth.currentUser.email;
    this.imgUrl = afAuth.auth.currentUser.photoURL;
  }
  logoutUser() {
      this.afAuth.auth.signOut().then(
          () => {
            this.cookieService.put('uid', '');
            this.cookieService.put('connected', 'false');
            this.router.navigateByUrl('login');
          }
      );
  }
}
