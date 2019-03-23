import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public signupForm: FormGroup;
  public loading: any;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private router: Router,
    private afAuth: AngularFireAuth,
    private cookieService: CookieService
  ) {
    this.signupForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required]),
      ],
      username: [
          '',
          Validators.compose([Validators.minLength(6), Validators.required]),
      ]
    });
  }

  ngOnInit() {
  }

  async signupUser(signupForm: FormGroup): Promise<void> {
    if (!signupForm.valid) {
      console.log('Need to complete the form, current value: ', signupForm.value);
    } else {
      const email: string = signupForm.value.email;
      const password: string = signupForm.value.password;
      const username = signupForm.value.username;
      this.authService.signupUser(email, password, username).then(
        () => {
          this.loading.dismiss().then(() => {
            this.router.navigateByUrl('home');
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

  async webGoogleSignup(): Promise<void> {
      try {
          const provider = new firebase.auth.GoogleAuthProvider();
          const credential = await this.afAuth.auth.signInWithPopup(provider);
          console.log(credential.user);
          firebase.firestore().doc(`/userProfile/${credential.user.uid}`).set({
              username: credential.user.displayName,
              email: credential.user.email
          });
          this.router.navigateByUrl('home');
          this.cookieService.put('uid', credential.user.uid);
      } catch (err) {
          console.log(err);
      }
  }
}
