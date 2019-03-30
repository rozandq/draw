import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ScanPagePage } from './scan-page.page';
import {QRScanner} from '@ionic-native/qr-scanner/ngx';

const routes: Routes = [
  {
    path: '',
    component: ScanPagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: ScanPagePage }])
  ],
  declarations: [ScanPagePage],
  providers: [QRScanner]
})
export class ScanPagePageModule {}
