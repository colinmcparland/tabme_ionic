import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AddfriendPage } from '../addfriend/addfriend';
import { AdddebitPage } from '../adddebit/adddebit';
import { PaybackPage } from '../payback/payback';
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

  private email: string;
  private emailIsLoaded: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public storage: Storage) {
    this.emailIsLoaded = false;
    this.getUserEmail();
  }

  ionViewDidLoad() {
    this.viewCtrl.showBackButton(false);
  }

  addFriendPage()	{
  	this.navCtrl.push(AddfriendPage);
  }

  addDebitPage() {
    this.navCtrl.push(AdddebitPage);
  }

  payBackPage() {
    this.navCtrl.push(PaybackPage);
  }

  logout()  {
    this.storage.clear();
    this.navCtrl.popToRoot();
  }

  getUserEmail() {
    Promise.all([this.storage.get('email')]).then((val) => {
      this.email = val[0].split('@')[0];
      this.emailIsLoaded = true;
    });
  }

}
