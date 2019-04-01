import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-size-menu',
  templateUrl: './size-menu.component.html',
  styleUrls: ['./size-menu.component.scss']
})
export class SizeMenuComponent implements OnInit {

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  returnSize(width: number, selectedWidth: number){
    this.popoverController.dismiss({width, selectedWidth});
  }
}
