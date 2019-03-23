import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { CookieService } from 'ngx-cookie';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private cookieService: CookieService
  ) { }

  async loginUser(email: string, password: string): Promise<any> {
    const credential = await firebase.auth().signInWithEmailAndPassword(email, password);
    this.cookieService.put('uid', credential.user.uid);
  }

  signupUser(email: string, password: string, username: string): Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(newUserCredential => {
      firebase.firestore().doc(`/userProfile/${newUserCredential.user.uid}`).set({ email });
      
    }).catch(error => {
      console.error(error);
      throw new Error(error);
    });
  }

  resetPassword(email:string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser():Promise<void> {
    return firebase.auth().signOut();
  }    
}
