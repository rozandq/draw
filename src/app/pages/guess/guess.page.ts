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
  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  letters_to_display = [];
  display = [true, true, true, true, true, true, true, true, true, true, true, true];
  letters1 = [];
  letters2 = [];
  answer = [];
  color_answer = '#F8FB3E';

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
        this.word = doc.data().word.toUpperCase();
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
        /* console.log('letters ' + this.letters_to_display);
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
        console.log('l2 ' + this.letters2); */
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
    console.log('*' + this.word.toUpperCase() + '* *' + res + '*');
    if (this.word.toUpperCase() === res) {
      this.color_answer = '#65F721';
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
  push(l, i) {
      const i_fp = this.firstPlace();
      console.log('push ' + l + ' at ' + i_fp);
      if (this.firstPlace() !== -1) {
          this.answer[i_fp] = ({l: l, i: i, i_a: i_fp});
          this.display[i] = false;
          this.checkWord();
      }
      console.log(this.answer);
      /* if (this.firstPlace() !== -1) {
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
      }*/
  }
  pop(l) {
      this.answer[l.i_a] = {l: '  '};
      this.display[l.i] = true;
      /* console.log('pop');
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
      }*/
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
