import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { CookieService } from 'ngx-cookie';
import {AngularFirestore} from '@angular/fire/firestore';
import {Error} from 'tslint/lib/error';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {AngularFireAuth} from '@angular/fire/auth';
import {Platform} from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private cookieService: CookieService,
    private gplus: GooglePlus,
    private afAuth: AngularFireAuth,
    private platform: Platform
  ) { }

  async loginUser(email: string, password: string): Promise<any> {
    const credential = await firebase.auth().signInWithEmailAndPassword(email, password);
    this.cookieService.put('uid', credential.user.uid);
  }

  signupUser(email: string, password: string, username: string): Promise<any> {
      return firebase.auth().createUserWithEmailAndPassword(email, password).then(newUserCredential => {
          firebase.auth().currentUser.updateProfile({displayName: username, photoURL: ''});
          firebase.firestore().doc(`/userProfile/${newUserCredential.user.uid}`).set({ username: username,
              email: email,
              uid: newUserCredential.user.uid });
    }).catch(error => {
      console.error(error);
      throw new Error(error);
    });
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
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
            } else {
                const provider = new firebase.auth.GoogleAuthProvider();
                const credential = await this.afAuth.auth.signInWithPopup(provider);
                firebase.auth().currentUser.updateProfile(
                    {displayName: firebase.auth().currentUser.displayName, photoURL: credential.user.photoURL});
                firebase.firestore().doc(`/userProfile/${credential.user.uid}`).set({
                    username: credential.user.displayName,
                    email: credential.user.email,
                    photoUrl: credential.user.photoURL
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
}
