import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.scss']
})
export class FriendRequestsComponent implements OnInit {
  friend_reqs = [];

  constructor(
      private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.friendReqsInit();
  }
  friendReqsInit() {
    firebase.firestore().collection('friend_request').where('uid', '==', firebase.auth().currentUser.uid).onSnapshot(
        snap => {
            if (snap.empty) {
                console.log('No matching documents.');
                return;
            }
            const reqs = [];
            snap.forEach(
                doc => {
                  firebase.firestore().doc(`/userProfile/${doc.data().req_uid}`).get().then(
                      user => {
                        reqs.push({
                            user: user,
                            id: doc.id
                        });
                      }
                  );
                }
            );
            this.friend_reqs = reqs;
            console.log(this.friend_reqs);
        }
    );
  }
  acceptFriendReq(uid, id) {
      console.log(uid);
      console.log(id);
      this.addFriend(firebase.auth().currentUser.uid, uid);
      this.addFriend(uid, firebase.auth().currentUser.uid);
      firebase.firestore().collection('friend_request').doc(id).delete().catch(
          err => {
              console.log(`Encountered error: ${err}`);
          }
      );
  }
  addFriend(uid1, uid2) {
      const new_friends = [uid2];
      firebase.firestore().collection('friend_list').where('uid', '==', uid1).get().then(
          snap => {
              if (snap.empty || snap.size > 1) {
                  console.log('No matching documents.');
                  firebase.firestore().collection('friend_list').doc().set({
                     uid: uid1,
                     friends: [<string> uid2]
                  });
                  return;
              }
              snap.forEach(
                  doc => {
                      doc.data().friends.forEach(
                          friend => new_friends.push(friend)
                      );
                      firebase.firestore().doc(`/friend_list/${doc.id}`).update('friends', new_friends).catch(
                          err => {
                              console.log(`Encountered error: ${err}`);
                          }
                      );
                  }
              );
              this.popoverController.dismiss();
          }
      );
  }
}
