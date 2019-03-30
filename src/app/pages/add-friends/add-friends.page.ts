import { Component, OnInit } from '@angular/core';
import {ToastController} from '@ionic/angular';

import * as firebase from 'firebase/app';
import {ArrayType} from '@angular/compiler';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.page.html',
  styleUrls: ['./add-friends.page.scss'],
})
export class AddFriendsPage implements OnInit {
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
                    if (doc.data().username.toLowerCase().includes(this.searchUser.toLowerCase())
                        && doc.id !== firebase.auth().currentUser.uid) {
                        this.alreadyFriend(doc.id).then(
                            res => {
                                if (!res) {
                                    new_users.push(doc);
                                }
                            }
                        );
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
    async alreadyFriend(uid) {
        return firebase.firestore().collection('friend_list').where('uid', '==', firebase.auth().currentUser.uid).get().then(
            snapshot => {
                if (snapshot.empty || snapshot.size > 1) {
                    console.log('No matching documents.');
                    return false;
                }
                let res = false;
                snapshot.forEach(
                    doc => {
                        console.log(doc.data().username);
                        console.log(doc.data().friends);
                        console.log('contains ' + (doc.data().friends.indexOf(uid) !== -1));
                        res = (doc.data().friends.indexOf(uid) !== -1) || res ;
                    }
                );
                return res;
            }
        );
    }
}
