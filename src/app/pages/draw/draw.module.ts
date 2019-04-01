import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DrawPage } from './draw.page';
import { ColorMenuComponent } from './color-menu/color-menu.component';
import { SizeMenuComponent } from './size-menu/size-menu.component';
import { SharedModule } from '../../shared.module'

const routes: Routes = [
  {
    path: '',
    component: DrawPage
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
  declarations: [
    DrawPage,
    ColorMenuComponent,
    SizeMenuComponent
  ],
  entryComponents: [
    ColorMenuComponent,
    SizeMenuComponent,
  ]
})
export class DrawPageModule {}
