import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.component.html',
  styleUrls: ['./add-friends.component.scss']
})
export class AddFriendsComponent implements OnInit {
  searchUser = '';
  users = [];
  usersToDisplay = [];
  uid = '';
  constructor(
      private toastController: ToastController
  ) {
    this.uid = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
      this.filterUsers();
  }
  filterUsers() {
    const new_users = []
    firebase.firestore().collection('/userProfile').get().then(
      snapshot => {
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }
        snapshot.forEach(doc => {
          console.log(doc.data().username);
          if (doc.data().username.toLowerCase().includes(this.searchUser.toLowerCase())
                && doc.id !== firebase.auth().currentUser.uid) {
            console.log(true);
            new_users.push(doc);
          }
        });
        this.users = new_users;
      }
    );
  }
  friendRequest(uid) {
      firebase.firestore().collection('/friend_request').doc().set({
        uid: uid,
        req_uid: firebase.auth().currentUser.uid
      }).then(
          () => this.reqToast()
      );
  }
  async reqToast() {
    const toast = await this.toastController.create({
      message: 'Friend request sent',
      duration: 2000
    });
    toast.present();
  }

  loadData(ev) {
      console.log('scroll');
  }
}
