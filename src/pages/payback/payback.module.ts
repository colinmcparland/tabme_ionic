import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaybackPage } from './payback';

@NgModule({
  declarations: [
    PaybackPage,
  ],
  imports: [
    IonicPageModule.forChild(PaybackPage),
  ],
})
export class PaybackPageModule {}
