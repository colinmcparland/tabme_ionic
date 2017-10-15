import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AddfriendPage } from '../addfriend/addfriend';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public storage: Storage) {
  }

  ionViewDidLoad() {
    this.viewCtrl.showBackButton(false);
  }

  addFriendPage()	{
  	this.navCtrl.push(AddfriendPage);
  }

  logout()  {
    this.storage.clear();
    this.navCtrl.popToRoot();
  }

}
