import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentsetupPage } from './paymentsetup';

@NgModule({
  declarations: [
    PaymentsetupPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentsetupPage),
  ],
})
export class PaymentsetupPageModule {}
