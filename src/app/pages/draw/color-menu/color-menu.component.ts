import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-color-menu',
  templateUrl: './color-menu.component.html',
  styleUrls: ['./color-menu.component.scss']
})

export class ColorMenuComponent implements OnInit {

  constructor(private popoverController : PopoverController) { }

  ngOnInit() {
  }

  returnColor(color: string, selectedColor: number){
    this.popoverController.dismiss({color, selectedColor});
  }

}

