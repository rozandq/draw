import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/user/auth.service';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: Observable<firebase.User>;
  google = 'google';

  public loginForm: FormGroup;
  public loading: HTMLIonLoadingElement;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private gplus: GooglePlus,
    private platform: Platform,
    private cookieService: CookieService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['',
      Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });

    this.user = this.afAuth.authState;
  }

  ngOnInit() {
  }

  async loginUser(loginForm: FormGroup): Promise<void> {
    if (!loginForm.valid) {
      console.log('Form is not valid yet, current value:', loginForm.value);
    } else {
      const email = loginForm.value.email;
      const password = loginForm.value.password;
      this.authService.loginUser(email, password).then(
        () => {
          this.loading.dismiss().then(() => {
            this.cookieService.put('connected', 'true');
            this.router.navigateByUrl('tabs');
          });
        },
        error => {
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }],
            });
            await alert.present();
          });
        }
      );
      this.loading = await this.loadingCtrl.create();
      await this.loading.present();
    }
  }
  async webGoogleLogin(): Promise<void> {
    try {
      if (this.platform.is('cordova')) {
          /* const credential = await */
          console.log('certif ' + await this.gplus.getSigningCertificateFingerprint());
          const gplusUser = await this.gplus.login({
              'webClientId': '377697817882-s9nusq9lnoe5pfkipagccekt2203tqur.apps.googleusercontent.com',
              'offline': true,
              'scopes': 'profile email'
          });
          const credential = firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken);
          this.afAuth.auth.signInWithCredential(credential);
          firebase.firestore().doc(`/userProfile/${firebase.auth().currentUser.uid}`).set({
              username: firebase.auth().currentUser.displayName,
              email: firebase.auth().currentUser.email,
              photoUrl: firebase.auth().currentUser.photoURL
          });
          this.router.navigateByUrl('tabs');
          this.cookieService.put('uid', firebase.auth().currentUser.uid);
          this.cookieService.put('connected', 'true');
      } else {
          const provider = new firebase.auth.GoogleAuthProvider();
          const credential = await this.afAuth.auth.signInWithPopup(provider);
          console.log(this.afAuth.auth.currentUser);
          firebase.auth().currentUser.updateProfile(
              {displayName: firebase.auth().currentUser.displayName, photoURL: credential.user.photoURL});
          firebase.firestore().doc(`/userProfile/${credential.user.uid}`).set({
              username: credential.user.displayName,
              email: credential.user.email,
              photoUrl: credential.user.photoURL
          });
          this.router.navigateByUrl('tabs');
          this.cookieService.put('uid', credential.user.uid);
          this.cookieService.put('connected', 'true');
      }
      /* this.googlePlus.login({})
          .then(res => console.log(res))
          .catch(err => console.error(err)); */
    } catch (err) {
        console.log(err);
    }
  }
}
