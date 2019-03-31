import { Component, OnInit } from '@angular/core';
import {GameService} from '../../services/game.service';
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.page.html',
  styleUrls: ['./draw.page.scss'],
})
export class DrawPage implements OnInit {
  events = [];
  game_id = '';
  constructor(
      public gameService: GameService,
      private cookieService: CookieService
  ) {
    this.game_id = this.cookieService.get('current_game_id');
    console.log('game_id ' + this.game_id);
  }

  ngOnInit() {}
}
