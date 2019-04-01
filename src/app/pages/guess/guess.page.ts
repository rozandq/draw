import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CanvasComponent } from 'src/app/components/canvas/canvas.component';
import {AlertController} from '@ionic/angular';
import {Vibration} from '@ionic-native/vibration/ngx';
import {CookieService} from 'ngx-cookie';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-guess',
  templateUrl: './guess.page.html',
  styleUrls: ['./guess.page.scss'],
})
export class GuessPage implements OnInit {
  color: string;
  lineWidth: number;
  word: string;
  game_id = '';
  // answer = '';
  letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  letters_to_display = [];
  letters1 = [];
  letters2 = [];
  answer = [];
  color_answer = 'warning';

  @ViewChild('canvasComponent') canvasComponent: CanvasComponent;
  constructor(
    private cookieService: CookieService,
    public gameService: GameService,
    private alertController: AlertController,
    private vibration: Vibration
  ) {
    this.game_id = this.cookieService.get('current_game_id');
    console.log(this.game_id);
    firebase.firestore().collection('game').doc(this.game_id).get().then(
      doc => {
        this.word = doc.data().word;
        for (const l of this.word) {
            this.letters_to_display.push(l);
            this.answer.push({
                l: '  '
            });
        }
        for (let i = 0; i < 12 - this.word.length; i++) {
            this.letters_to_display.push(this.letters[Math.floor((Math.random() * 26))]);
        }
        this.letters_to_display = this.shuffle(this.letters_to_display);
        console.log('letters ' + this.letters_to_display);
        for (let i = 0; i < 6; i++) {
            this.letters1.push({
                l: this.letters_to_display.shift(),
                list: 1,
                i: i,
                i_a: -1
            });
        }
        console.log('letters ' + this.letters_to_display);
        console.log('l1 ' + this.letters1);
        for (let i = 0; i < 6; i++) {
          this.letters2.push(
              {
                  l: this.letters_to_display.shift(),
                  list: 2,
                  i: i,
                  i_a: -1
              });
        }
        console.log('l2 ' + this.letters2);
      }
    );
  }

  ngOnInit() {
    firebase.firestore().collection('game').doc(this.game_id).get().then(res => {
      this.canvasComponent.setAndDrawAllWithTimeout(res.data().drawEvents);
      this.word = res.data().word;
    });
  }

  checkWord() {
    let res = '';
    for (const l of this.answer) {
        res += l.l;
    }
    console.log('*' + this.word + '* *' + res + '*');
    if (this.word === res) {
      this.color = 'success';
      this.presentWinCode().then(
          () => this.vibration.vibrate(500)
      );
    }
  }
  async presentWinCode() {
      const alert = await this.alertController.create({
          header: 'SUCCESS',
          subHeader: 'You found the good word',
          message: 'You earned 5 stars!',
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
  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  push(l) {
      if (this.firstPlace() !== -1) {
          l.i_a = this.firstPlace();
          console.log('push ' + l.i_a);
          this.answer[l.i_a] = l;
          console.log(this.answer);
          if (l.list === 1) {
              this.letters1.splice(l.i, 1);
          } else {
              this.letters2.splice(l.i, 1);
          }
          this.checkWord();
      }
  }
  pop(l) {
      console.log('pop');
      if (l.l !== '  ') {
          console.log(l);
          if (l.list === 1) {
              console.log('list 1');
              this.letters1.splice(l.i, 0, l);
              this.answer[l.i_a] = {
                  l: '  '
              };
          } else if (l.list === 2) {
              console.log('list 2');
              this.letters2.splice(l.i, 0, l);
              this.answer[l.i_a] = {
                  l: '  '
              };
          }
      }
  }
  firstPlace(): number {
      let res = -1;
      for (let i = 0; i < this.answer.length; i++) {
          if (this.answer[i].l === '  ') {
              res = i;
              break;
          }
      }
      return res;
  }
}
