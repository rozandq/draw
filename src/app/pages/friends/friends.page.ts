import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {AngularFireAuth} from '@angular/fire/auth';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import * as firebase from 'firebase/app';
import { ToastController } from '@ionic/angular';
import {forEach} from '@angular-devkit/schematics';
import { PopoverController } from '@ionic/angular';
import { AddFriendsComponent } from './add-friends/add-friends.component';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';

@Component({
  selector: 'app-friends',
  templateUrl: 'friends.page.html',
  styleUrls: ['friends.page.scss']
})
export class FriendsPage {
    friends_uid = [];
    friends = [];
    nbFriendReq = 0;
    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private googlePlus: GooglePlus,
        private cookieService: CookieService,
        public toastController: ToastController,
        public popoverController: PopoverController
    ) {
        this.loadFriends();
        this.initNbFriendReq();
    }
    delete(uid) {
        this.deleteFriend(this.afAuth.auth.currentUser.uid, uid);
        this.deleteFriend(uid, this.afAuth.auth.currentUser.uid);

    }
    deleteFriend(uid, friend_to_delete) {
        console.log(uid + ' ' + friend_to_delete);
        const new_friends = [];
        firebase.firestore().collection('friend_list').where('uid', '==', uid).get().then(
            snapshot => {
                console.log(snapshot);

                if (snapshot.empty || snapshot.size > 1) {
                    console.log('No matching documents.');
                    return;
                }
                snapshot.forEach(doc => {
                    for (const friend of doc.data().friends) {
                        if (friend !== friend_to_delete) {
                            new_friends.push(friend);
                        }
                    }
                    console.log(new_friends);
                    firebase.firestore().collection('friend_list').doc(doc.id).update('friends', new_friends).then(
                        () => this.deleteToast()
                    ).catch(
                        () => this.errorToast()
                    );
                });
            }
        ).catch(err => {
            console.log('Error getting documents', err);
        });
    }
    async deleteToast() {
        const toast = await this.toastController.create({
            message: 'Friend successfully removed',
            duration: 2000
        });
        toast.present();
    }
    async errorToast() {
        const toast = await this.toastController.create({
            message: 'Error when removing friend. Try later.',
            duration: 2000
        });
        toast.present();
    }
    async presentPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: <any> AddFriendsComponent,
            event: ev,
            cssClass: 'popover_class'
        });
        return await popover.present();
    }
    loadFriends() {
        firebase.firestore().collection('/friend_list').where('uid', '==', this.afAuth.auth.currentUser.uid).onSnapshot(
            snapshot => {
                if (snapshot.empty || snapshot.size > 1) {
                    console.log('No matching documents.');
                    return;
                }
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    this.friends_uid = doc.data().friends;
                    const new_friends = [];
                    for (const uid of this.friends_uid) {
                        console.log(uid);
                        firebase.firestore().collection('userProfile').doc(uid).get()
                            .then(document => {
                                if (!document.exists) {
                                    console.log('No such document!');
                                } else {
                                    console.log('Document data:', document.data());
                                    new_friends.push({
                                        username: document.data().username, photoUrl: document.data().photoUrl, uid: document.id
                                    });
                                }
                            })
                            .catch(err => {
                                console.log('Error getting document', err);
                            });
                    }
                    this.friends = new_friends;
                });
            }, err => {
                console.log(`Encountered error: ${err}`);
            });
    }
    initNbFriendReq() {
        firebase.firestore().collection('friend_request').where('uid', '==', firebase.auth().currentUser.uid).onSnapshot(
            snapshot => {
                if (snapshot.empty) {
                    console.log('No matching documents.');
                    return;
                }
                this.nbFriendReq = snapshot.size;
                /* snapshot.forEach(doc => {
                  firebase.firestore().doc(`/friend_request/${doc.id}`).delete().catch(
                    err => {
                      console.log('Error deleting document', err);
                    }
                  );
                }); */
            }
        );
    }
    async popoverFriendRequests(ev: any) {
        const popover = await this.popoverController.create({
            component: <any> FriendRequestsComponent,
            event: ev,
            cssClass: 'popover_class'
        });
        return await popover.present();
    }
}
