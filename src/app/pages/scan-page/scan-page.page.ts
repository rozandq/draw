import { Component, OnInit } from '@angular/core';
import {AlertController, NavController, Platform, ToastController} from '@ionic/angular';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner/ngx';
import {Router} from '@angular/router';

import * as firebase from 'firebase/app';
// import {Vibration} from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.page.html',
  styleUrls: ['./scan-page.page.scss'],
})
export class ScanPagePage implements OnInit {
    constructor(
                public qrScanner: QRScanner,
                public platform: Platform,
                public alertController: AlertController,
                private router: Router,
                private toastController: ToastController,
                // private vibration: Vibration
    ) {

        platform.ready().then(() => {
            this.openScanner();
        });
    }

    ngOnInit() {}

    showCamera() {
        (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    }

    hideCamera() {
        (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    }

    openScanner() {
        this.qrScanner.prepare().then((status: QRScannerStatus) => {
            if (status.authorized) {
                // camera permission was granted
                const scanSub = this.qrScanner.scan().subscribe((text: string) => {
                    console.log('Scanned something ' + text);
                    try {
                        const ref = firebase.firestore().collection('userProfile').doc(text);
                        const req = ref.get().then(
                            doc => {
                                if (!doc.exists) {
                                    console.log('No such document!');
                                    this.presentBadQRCode(scanSub);
                                } else {
                                    this.presentAlertConfirmFriendRequest(doc, scanSub);
                                    console.log('Document data:', doc.data());
                                }
                            }
                        );
                    } catch (err) {
                        console.log('Error getting document: ' + err);
                        this.presentBadQRCode(scanSub);
                    }

                    // this.vibration.vibrate(500);
                });
                this.showCamera();
                // show camera preview
                this.qrScanner.show();
            }
        }).catch((err: any) => {
                this.presentBadQRCode(null);
                console.log('ERREUR!!! ' + err);
            });
    }

    async presentAlertConfirmFriendRequest(user, scan) {
        const alert = await this.alertController.create({
            header: 'Add friend by QRScan',
            subHeader: 'Do you want to add this user ?',
            message:
                '<ion-label>' + user.data().username + '</ion-label>',
            buttons: [{
                    text: 'Cancel',
                    handler: () => {
                        console.log('Cancel');
                        this.hideCamera();
                        this.qrScanner.hide();
                        scan.unsubscribe();
                        this.qrScanner.destroy();
                        this.router.navigateByUrl('tabs/friends');
                    }
                },
                {
                text: 'Confirm',
                handler: () => {
                    console.log('Confirm Okay');
                    this.hideCamera();
                    this.qrScanner.hide();
                    this.friendRequest(user);
                    scan.unsubscribe();
                    this.qrScanner.destroy();
                    this.router.navigateByUrl('tabs/friends');
                }
            }]
        });

        await alert.present();
    }

    async presentBadQRCode(scan) {
        const alert = await this.alertController.create({
            header: 'Add friend by QRScan',
            subHeader: 'Error',
            message: 'Bad QRCode scanned',
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                        this.hideCamera();
                        this.qrScanner.hide();
                        if (scan !== null) { scan.unsubscribe(); }
                        this.qrScanner.destroy();
                        this.router.navigateByUrl('tabs/friends');
                    }
                }]
        });

        await alert.present();
    }
    friendRequest(doc) {
        this.alreadyFriend(doc.id).then(
            res => {
                if (!res) {
                    firebase.firestore().collection('/friend_request').doc().set({
                        uid: doc.id,
                        req_uid: firebase.auth().currentUser.uid
                    }).then(
                        () => this.reqToast()
                    );
                }
            }
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
