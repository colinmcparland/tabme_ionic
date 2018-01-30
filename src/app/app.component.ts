import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InfoPage } from '../pages/info/info';
import { LoginPage } from '../pages/login/login';
import { PaymentsetupPage } from '../pages/paymentsetup/paymentsetup';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {


  rootPage:any;


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, storage: Storage) {

    platform.ready().then(() => {
      storage.get('first_time').then((res) => {

        console.log(res);
        
        if(res == null) {
          console.log('no bit set');
          storage.set('first_time', 1).then((val) => {
            this.rootPage = InfoPage;
          })
        } else if(res == 1){
          this.rootPage = LoginPage;
        }

        statusBar.styleDefault();
        splashScreen.hide();
      })
    });

  }

}
