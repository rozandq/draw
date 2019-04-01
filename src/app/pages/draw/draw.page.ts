import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { CanvasComponent } from 'src/app/components/canvas/canvas.component';
import { ColorMenuComponent } from './color-menu/color-menu.component';
import { SizeMenuComponent } from './size-menu/size-menu.component';
import {CookieService} from 'ngx-cookie';
import {GameService} from '../../services/game.service';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-draw',
  templateUrl: './draw.page.html',
  styleUrls: ['./draw.page.scss'],
})
export class DrawPage implements OnInit, AfterViewInit {
  @Input() word : string;
  @ViewChild("canvasComponent") canvasComponent : CanvasComponent;

  game_id = '';
  selectedColor : number;
  selectedWidth : number;
  color : string;
  lineWidth : number;
  size : string;
  sizes : string[] = ["small", "medium", "large", "extra-large"];

  constructor(
    private popoverController: PopoverController,
    public gameService: GameService,
    private cookieService: CookieService
    ) {
    console.log("Start Draw");

    this.selectedColor = 0;
    this.selectedWidth = 1;
    this.color = '#2ecc71';
    this.lineWidth = 10;
    this.size = "medium";

    this.game_id = this.cookieService.get('current_game_id');
  }

  ngOnInit() {
    firebase.firestore().collection('game').doc(this.game_id).get().then(res => {
      this.word = res.data().word;
    })
  }

  ngAfterViewInit() {}

  async showColors(event){
    const popover = await this.popoverController.create({
        component: <any> ColorMenuComponent,
        componentProps: {
          selectedColor : this.selectedColor
        },
        event: event,
        cssClass: 'popover_color_class'
    });

    popover.onDidDismiss().then((res) => {
      if(res.data){
        this.color = res.data.color;
        this.selectedColor = res.data.selectedColor;
      }
    })
    return await popover.present();
  }

  async showSizes(event){
    const popover = await this.popoverController.create({
        component: <any> SizeMenuComponent,
        componentProps: {
          selectedWidth : this.selectedWidth
        },
        event: event,
        cssClass: 'popover_size_class'
    });

    popover.onDidDismiss().then((res) => {
      if(res.data){
        this.lineWidth = res.data.width;
        this.selectedWidth = res.data.selectedWidth;
        this.size = this.sizes[this.selectedWidth];
      }
    })
    return await popover.present();
  }


  changeLineWidth(width : number, indice : number) {
    this.lineWidth = width;
    this.selectedWidth = indice;
  }

  undo() {
    this.canvasComponent.undo();
  }

  redo() {
    this.canvasComponent.redo();
  }

  // send() {
  //   this.drawService.pushDraw(0, 1, this.canvasComponent.drawEvents, "test");
  //   this.navCtrl.navigateForward('guess');
  // }

  clear() {
    this.canvasComponent.clear();
  }

}
