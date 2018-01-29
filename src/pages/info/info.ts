import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';

/**
 * Generated class for the InfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

  private loginPage: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public viewCtrl: ViewController) {
    this.loginPage = LoginPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
    this.goToLogin();
    this.viewCtrl.showBackButton(false);
  }

  /**
   * Function to go to the login page if we've opened the app before.
   */
  goToLogin() {
    this.storage.get('first_time').then((res) => {
      if(res == null) {
        console.log('no bit set');
        this.storage.set('first_time', 1).then((val) => {
          
        })
      } else if(res == 1){
        this.navCtrl.push(LoginPage);
      }
    })
  }

}
