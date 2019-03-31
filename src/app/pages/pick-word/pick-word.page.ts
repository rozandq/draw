import { Component, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie';

import * as firebase from 'firebase/app';
import {GameService} from '../../services/game.service';

@Component({
  selector: 'app-pick-word',
  templateUrl: './pick-word.page.html',
  styleUrls: ['./pick-word.page.scss'],
})
export class PickWordPage implements OnInit {
  game_id = '';
  game;
  words = [];
  constructor(
    private cookieService: CookieService,
    public gameService: GameService
  ) {
      this.game_id = this.cookieService.get('current_game_id');
      console.log(this.game_id);
      firebase.firestore().collection('game').doc(this.game_id).get().then(
          doc => {
              if (!doc.exists) {
                  console.log('doc not found');
                  return;
              }
              this.game = doc;
          }
      );
      firebase.firestore().collection('words').doc('IgCfNXZoYUen2PfhL7qn').get().then(
          doc => {
              const size = doc.data().word.length;
              for (let i = 0; i < 3; i = i + 1) {
                  let word = doc.data().word[Math.floor((Math.random() * size))];
                  while (this.words.indexOf(word) !== -1) {
                      word = doc.data().word[Math.floor((Math.random() * size))];
                  }
                  this.words.push(word);
              }
              console.log(this.words);
          }
      );
  }

  ngOnInit() {}
}
