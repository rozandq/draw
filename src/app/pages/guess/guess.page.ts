import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase/app';
import {CookieService} from 'ngx-cookie';
import {GameService} from '../../services/game.service';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-guess',
  templateUrl: './guess.page.html',
  styleUrls: ['./guess.page.scss'],
})
export class GuessPage implements OnInit {
  word = '';
  game_id = '';
  answer = '';
  constructor(
    private cookieService: CookieService,
    public gameService: GameService,
    private alertController: AlertController
  ) {
    this.game_id = this.cookieService.get('current_game_id');
    console.log(this.game_id);
    firebase.firestore().collection('game').doc(this.game_id).get().then(
      doc => {
        this.word = doc.data().word;
      }
    );
  }

  ngOnInit() {
  }
  checkWord() {
    console.log('*' + this.word + '* *' + this.answer + '*');
    if (this.word === this.answer) {
      this.gameService.endGame(this.game_id);
    }
  }
  async presentBadQRCode() {
      const alert = await this.alertController.create({
          header: 'SUCCESS',
          subHeader: 'You found the good word',
          message: 'You earned 50 stars!',
          buttons: [
              {
                  text: 'Get it!',
                  handler: () => {
                      this.gameService.endGame(this.game_id);
                  }
              }]
      });

      await alert.present();
  }
}
