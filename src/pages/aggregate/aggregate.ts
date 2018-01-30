import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AlertController, LoadingController } from 'ionic-angular';

/**
 * Generated class for the AggregatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aggregate',
  templateUrl: 'aggregate.html',
})
export class AggregatePage {

  public email: string;
  private owing: any;
  private owed: any;
  private balance: any;
  private fetchHistoryComplete: boolean;
  private loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public http: Http, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.email = this.navParams.get('email');
    this.fetchHistoryComplete = false;
    this.loading = this.startLoading();

    this.getHistory();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AggregatePage');
    this.loading.present();
    console.log(this.email);
  }

  startLoading() {
    let loading = this.loadingCtrl.create({});
    return loading;
  }


  getHistory() {
    //  Get variables
    var access_token = this.storage.get('access_token');
    var refresh_token = this.storage.get('refresh_token');
    var user_id = this.storage.get('id');

    Promise.all([access_token, refresh_token, user_id]).then((val) => {
      // Set the headers
      var headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('X-Requested-With', 'XMLHttpRequest');
      headers.append('Authorization', 'Bearer ' + val[0]);

      //  Create variable to pass into funciton later.
      var options = new RequestOptions({ headers: headers });

      let postParams = {
        user_id: val[2],
        email: this.email
      }
        
      // Make the request
      this.http.post("http://tabme.tinybird.ca/api/friend/aggregate", JSON.stringify(postParams), options)
          .subscribe(data => {

        this.loading.dismiss();

        //  Parse the response into an array
        var resp = JSON.parse(data['_body']);

        //  If the status code is 200 move to dashboard and start session
        if(resp.status == '200') {
          this.balance = resp.balance;
          this.owing = resp.owing;
          this.owed = resp.owed;
          this.fetchHistoryComplete = true;
        }
        else {
          //  No friends found
        }
      }, error => {
        console.log(error['_body']);
      });
    });
  }



}
