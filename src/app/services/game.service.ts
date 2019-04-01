import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import {PopoverController} from '@ionic/angular';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import { DocumentData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class GameService {
  constructor(
      private popoverController: PopoverController,
      private router: Router,
      private cookieService: CookieService
  ) { }
  newGame(uid) {
      firebase.firestore().collection('game_uids').doc().set({
          uids: [ <string> firebase.auth().currentUser.uid, <string> uid],
          step: 'pick-word',
          turn: firebase.auth().currentUser.uid
      }).then(
          () => {
            this.popoverController.dismiss();
          }
      );
  }

  async play(game_id): Promise<any> {
      console.log('play ' + game_id);
      return firebase.firestore().collection('game').doc(game_id).get().then(
          doc => {
              if (!doc.exists) {
                  console.log('Doc not found');
                  return;
              }
              if (doc.data().step === 'pick-word') {
                  this.cookieService.put('current_game_id', doc.id);
                  this.router.navigateByUrl('pick-word');
              } else if (doc.data().step === 'draw') {
                  this.cookieService.put('current_game_id', doc.id);
                  this.router.navigateByUrl('draw');
              } else if (doc.data().step === 'guess') {
                  this.cookieService.put('current_game_id', doc.id);
                  this.router.navigateByUrl('guess');
              }
          }
      );
  }
  pickWord(game_id, word) {
      firebase.firestore().collection('game').doc(game_id).update(
          {
              word: word,
              step: 'draw'
          }).then(
          () => {
              this.play(game_id);
          }
      );
  }
  validDraw(game_id, events) {
      console.log('validDraw');
      console.log('game ' + game_id);
      firebase.firestore().collection('game').doc(game_id).get().then(
          doc => {
              console.log('game2 ' + game_id);
              console.log(doc.data().uids);
              firebase.firestore().collection('game').doc(game_id).update(
              {
                  step: 'guess',
                  drawEvents: events,
                  turn: doc.data().uids[1]
              }).then(
                  () => this.router.navigateByUrl('tabs/play')
              );
          }
      );
  }
  endGame(game_id) {
      console.log('WIN!!!!!!!!!!!!');
      firebase.firestore().collection('game').doc(game_id).get().then(
          doc => {
              for (const u of doc.data().uids) {
                  firebase.firestore().collection('userProfile').doc(u).get().then(
                      user => {
                          firebase.firestore().collection('userProfile').doc(u).update('score', user.data().score + 5);
                      }
                  );
              }
              firebase.firestore().collection('past_game').doc(game_id).set({
                  uids: doc.data().uids,
                  word: doc.data().word
              }).then(
                  () => {
                      firebase.firestore().collection('game').doc(game_id).delete().then(
                          () => this.router.navigateByUrl('tabs/play')
                      );
                  }
              );
          }
      );
  }

}
