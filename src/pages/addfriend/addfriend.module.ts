import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddfriendPage } from './addfriend';

@NgModule({
  declarations: [
    AddfriendPage,
  ],
  imports: [
    IonicPageModule.forChild(AddfriendPage),
  ],
})
export class AddfriendPageModule {}
