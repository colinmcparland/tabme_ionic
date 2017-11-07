import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgModule, ErrorHandler } from '@angular/core';
import 'rxjs/add/operator/map';
import { AlertController, LoadingController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the DataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-data',
  templateUrl: 'data.html',
})
export class DataPage {

  public debitList: any;
  public creditList: any;
  public fetchDebitsComplete: boolean;
  public fetchCreditsComplete: boolean;
  private loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public http: Http, public loadingCtrl: LoadingController) {

    this.fetchDebitsComplete = false;
    this.fetchCreditsComplete = false;

    this.getDebitList();
    this.getCreditList();

    this.loading = this.startLoading();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataPage');
    this.loading.present();
  }

  startLoading() {
    let loading = this.loadingCtrl.create({});
    return loading;
  }

  getDebitList() {
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
        
      // Make the request
      this.http.get("http://tabme.tinybird.ca/api/debit/" + val[2], options)
          .subscribe(data => {

        //  Parse the response into an array
        var resp = JSON.parse(data['_body']);

        if(this.fetchCreditsComplete == true) {
          this.loading.dismiss();
        }   

        //  If the status code is 200 move to dashboard and start session
        if(resp.status == '200') {
          this.debitList = resp.content;
          this.fetchDebitsComplete = true;       
        }
        else {
          //  No friends found
        }
      }, error => {
        console.log(error['_body']);
      });
    });
  }

  getCreditList() {
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
          
        // Make the request
        this.http.get("http://tabme.tinybird.ca/api/debit/owing/" + val[2], options)
            .subscribe(data => {
  
          //  Parse the response into an array
          var resp = JSON.parse(data['_body']);
  
          console.log(resp);

          if(this.fetchDebitsComplete == true) {
            this.loading.dismiss();
          }  
  
          //  If the status code is 200 move to dashboard and start session
          if(resp.status == '200') {
            this.creditList = resp.content;
              this.fetchCreditsComplete = true;          
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
