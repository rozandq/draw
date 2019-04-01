import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GuessPage } from './guess.page';
import {Vibration} from '@ionic-native/vibration/ngx';

const routes: Routes = [
  {
    path: '',
    component: GuessPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GuessPage],
  providers: [ Vibration ]
})
export class GuessPageModule {}
