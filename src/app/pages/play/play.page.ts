import { Component } from '@angular/core';
import {AddFriendsComponent} from '../friends/add-friends/add-friends.component';
import { PopoverController } from '@ionic/angular';
import {NewGameComponent} from './new-game/new-game.component';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-play',
  templateUrl: 'play.page.html',
  styleUrls: ['play.page.scss']
})
export class PlayPage {
    currGames = [];
    constructor(
        private popoverController: PopoverController
    ) {
      this.initCurrGames();
    }
    async presentPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: <any> NewGameComponent,
            event: ev,
            cssClass: 'popover_class'
        });
        return await popover.present();
    }
    initCurrGames() {
        firebase.firestore().collection('game_uids').onSnapshot(
            snap => {
                if (snap.empty) {
                    return;
                }
                const new_currGames = [];
                snap.forEach(
                    doc => {
                        if (doc.data().uids.indexOf(firebase.auth().currentUser.uid) !== -1) {
                            const opp_uid = (
                                doc.data().uids[0] === firebase.auth().currentUser.uid
                            ) ? doc.data().uids[1] : doc.data().uids[0];
                            firebase.firestore().collection('userProfile').doc(opp_uid).get().then(
                                user => {
                                    new_currGames.push({
                                        game_id: doc.id,
                                        opp: {
                                            username: user.data().username,
                                            photoUrl: user.data().photoUrl,
                                            uid: opp_uid
                                        }
                                    });
                                }
                            );
                        }
                    }
                );
                this.currGames = new_currGames;
            }
        );
    }
}
