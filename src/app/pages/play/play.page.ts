import { Component } from '@angular/core';
import {AddFriendsComponent} from '../friends/add-friends/add-friends.component';
import { PopoverController } from '@ionic/angular';
import {NewGameComponent} from './new-game/new-game.component';
import * as firebase from 'firebase/app';
import {GameService} from '../../services/game.service';

@Component({
  selector: 'app-play',
  templateUrl: 'play.page.html',
  styleUrls: ['play.page.scss']
})
export class PlayPage {
    yourTurn = [];
    theirTurn = [];
    pasts = [];
    score = 0;
    constructor(
        private popoverController: PopoverController,
        public gameService: GameService
    ) {
      this.initCurrGames();
      this.initPastGames();
      this.initScore();
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
        firebase.firestore().collection('game').onSnapshot(
            snap => {
                if (snap.empty) {
                    return;
                }
                const new_yourTurn = [];
                const new_theirTurn = [];
                snap.forEach(
                    doc => {
                        if (doc.data().uids.indexOf(firebase.auth().currentUser.uid) !== -1) {
                            const opp_uid = (
                                doc.data().uids[0] === firebase.auth().currentUser.uid
                            ) ? doc.data().uids[1] : doc.data().uids[0];
                            firebase.firestore().collection('userProfile').doc(opp_uid).get().then(
                                user => {
                                    if (doc.data().turn === firebase.auth().currentUser.uid) {
                                        new_yourTurn.push({
                                            game_id: doc.id,
                                            opp: {
                                                username: user.data().username,
                                                photoUrl: user.data().photoUrl,
                                                uid: opp_uid
                                            }
                                        });
                                    } else {
                                        new_theirTurn.push({
                                            game_id: doc.id,
                                            opp: {
                                                username: user.data().username,
                                                photoUrl: user.data().photoUrl,
                                                uid: opp_uid
                                            }
                                        });
                                    }
                                }
                            );
                        }
                    }
                );
                this.yourTurn = new_yourTurn;
                this.theirTurn = new_theirTurn;
            }
        );
    }
    initPastGames() {
        firebase.firestore().collection('past_game').onSnapshot(
            snap => {
                if (snap.empty) {
                    return;
                }
                const new_past = [];
                snap.forEach(
                    doc => {
                        console.log(doc.data());
                        if (doc.data().uids.indexOf(firebase.auth().currentUser.uid) !== -1) {
                            console.log('mine');
                            const opp_uid = (
                                doc.data().uids[0] === firebase.auth().currentUser.uid
                            ) ? doc.data().uids[1] : doc.data().uids[0];
                            firebase.firestore().collection('userProfile').doc(opp_uid).get().then(
                                user => {
                                    console.log(user.data());
                                    console.log('ok');
                                    new_past.push({
                                        word: doc.data().word,
                                        opp: {
                                            username: user.data().username,
                                            photoUrl: user.data().photoUrl,
                                        }
                                    });
                                }
                            );
                        }
                    }
                );
                this.pasts = new_past;
                console.log(this.pasts);
                this.initCurrGames();
            }
        );
    }
    initScore() {
        firebase.firestore().collection('userProfile').doc(firebase.auth().currentUser.uid).onSnapshot(
            doc => {
                console.log(doc.data());
                this.score = doc.data().score;
            }
        );
    }
}
