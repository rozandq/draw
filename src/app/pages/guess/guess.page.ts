import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CanvasComponent } from 'src/app/components/canvas/canvas.component';
import {AlertController} from '@ionic/angular';
import {CookieService} from 'ngx-cookie';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-guess',
  templateUrl: './guess.page.html',
  styleUrls: ['./guess.page.scss'],
})
export class GuessPage implements OnInit {

  color : string;
  lineWidth : number;
  word : string;
  game_id = '';
  @ViewChild("answer") answer : any;

  @ViewChild("canvasComponent") canvasComponent : CanvasComponent;

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
    firebase.firestore().collection('game').doc(this.game_id).get().then(res => {
      this.canvasComponent.setAndDrawAllWithTimeout(res.data().drawEvents);
      this.word = res.data().word;
    })
  }

  checkWord() {
    console.log('*' + this.word + '* *' + this.answer.value + '*');
    if (this.word === this.answer.value) {
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
