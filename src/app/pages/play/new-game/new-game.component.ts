import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit {
  friends = [];
  constructor(
      private popoverController: PopoverController
  ) { }

  ngOnInit() {
      firebase.firestore().collection('friend_list').where('uid', '==', firebase.auth().currentUser.uid).onSnapshot(
          snapshot => {
              if (snapshot.empty || snapshot.size > 1) {
                  console.log('No matching documents.');
                  return;
              }
              snapshot.forEach(
                  doc => {
                      for (const friend of doc.data().friends) {
                          console.log(this.game_already_exists(firebase.auth().currentUser.uid, friend));
                          console.log(firebase.auth().currentUser.uid);
                          console.log(friend);
                          const exists = this.game_already_exists(firebase.auth().currentUser.uid, friend);
                          exists.then(
                              res => {
                                  console.log('exists test ' + res);
                                  if (!res) {
                                      firebase.firestore().collection('userProfile').doc(friend).get().then(
                                          user => {
                                              console.log(user.data().username);
                                              this.friends.push(user);
                                          }
                                      );
                                  }
                              }
                          );
                      }
                  }
              );
          }
      );
  }
  newGame(uid) {
      firebase.firestore().collection('game').doc().set({
          uids: [ <string> firebase.auth().currentUser.uid, <string> uid],
          step: 'pick-word',
          turn: firebase.auth().currentUser.uid
      }).then(
          () => this.onDismiss()
      );
  }
  async game_already_exists(uid1, uid2) {
      return firebase.firestore().collection('game').get().then(
          snapshot => {
              if (snapshot.empty) {
                  console.log('No matching documents.');
                  return false;
              }
              let res = false;
              snapshot.forEach(
                  doc => {
                      if ((doc.data().uids.indexOf(uid1) !== -1) && (doc.data().uids.indexOf(uid2) !== -1)) {
                          console.log('exists');
                          res = true;
                      }
                  }
              );
              return res;
          }
      );
  }
  async onDismiss() {
      try {
          await this.popoverController.dismiss();
      } catch (e) {
          //click more than one time popover throws error, so ignore...
      }

  }
}
