import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AggregatePage } from './aggregate';

@NgModule({
  declarations: [
    AggregatePage,
  ],
  imports: [
    IonicPageModule.forChild(AggregatePage),
  ],
})
export class AggregatePageModule {}
