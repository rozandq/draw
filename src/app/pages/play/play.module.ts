import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayPage } from './play.page';
import { NewGameComponent } from './new-game/new-game.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: PlayPage }])
  ],
  declarations: [PlayPage, NewGameComponent],
  entryComponents: [
      NewGameComponent
  ]
})
export class PlayPageModule {}
