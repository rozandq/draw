import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { GuessPage } from './guess.page';
import { SharedModule } from '../../shared.module'

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
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [GuessPage],
  entryComponents: []
})
export class GuessPageModule {}
