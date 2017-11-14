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
 * Generated class for the AdddebitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-adddebit',
  templateUrl: 'adddebit.html',
})
export class AdddebitPage {

	private friendsList: any;
	private debitList: any;
	private fetchFriendsComplete: boolean;
	private debit: FormGroup;
	private fetchDebitsComplete: boolean;
  private loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public http: Http, public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {

  	this.debit = this.formBuilder.group({
		amount: ['', Validators.required],
		debtor: ['', Validators.required]
	});

  	this.fetchFriendsComplete = false;
  	this.fetchDebitsComplete = false;
  	this.getDebitList();
  	this.getFriendsList();
    this.loading = this.startLoading();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdddebitPage');
    this.loading.present();
  }

  /**
   *  Functiion to start the loading icon up.
   */
  startLoading()  {
    let loading = this.loadingCtrl.create({});
    return loading;
  }

  getFriendsList() {
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
        user_id: val[2]
      }
        
      // Make the request
      this.http.post("http://tabme.tinybird.ca/api/friend/search/" + val[2], JSON.stringify(postParams), options)
          .subscribe(data => {

        //  Parse the response into an array
        var resp = JSON.parse(data['_body']);

        //  If the status code is 200 move to dashboard and start session
        if(resp.status == '200') {
          this.friendsList = resp.content;
          this.fetchFriendsComplete = true;
        }
        else {
          //  No friends found
        }
      }, error => {
        console.log(error['_body']);
      });
    });
  }

  addDebit() {
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
        id: val[2],
        email: this.debit.value.debtor,
        amount: this.debit.value.amount
      }

      let loading = this.startLoading();
      loading.present();
        
      // Make the request
      this.http.post("http://tabme.tinybird.ca/api/debit", JSON.stringify(postParams), options)
          .subscribe(data => {

        //  Parse the response into an array
        var resp = JSON.parse(data['_body']);
        loading.dismiss();

        //  If the status code is 200 move to dashboard and start session
        if(resp.status == '200') {
        	this.fetchDebitsComplete = false;
        	this.getDebitList();
        }
        else {
          //  No friends found
        }
      }, error => {
        console.log(error['_body']);
      });
    });
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

        this.loading.dismiss();

        //  Parse the response into an array
        var resp = JSON.parse(data['_body']);

        // console.log(resp);

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

    sendReminder($debit_id)  {
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

      //Start loading
      var loading = this.startLoading();
      loading.present();

      // Make the request
      this.http.get("http://tabme.tinybird.ca/api/debit/remind/" + $debit_id, options)
          .subscribe(data => {

        //  Stop loading
        loading.dismiss();

        var resp = JSON.parse(data['_body']);

        const alert = this.alertCtrl.create({
          title: 'Success',
          subTitle: 'Your reminder has been sent.',
          buttons: ['Close']
        });
        alert.present();
        
      }, error => {
        console.log(error['_body']);
      });
    });
  }



  deleteDebit($debit_id) {
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

      //  Show a verification window
      const validation_alert = this.alertCtrl.create({
        title: 'Are you sure?',
        subTitle: 'Are you sure you want to waive this debt?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              return;
            }
          },
          {
            text: 'Waive',
            handler: () => {
              //Start loading
              var loading = this.startLoading();
              loading.present();

              // Make the request
              this.http.get("http://tabme.tinybird.ca/api/debit/delete/" + $debit_id, options)
                  .subscribe(data => {

                //  Stop loading
                loading.dismiss();

                var resp = JSON.parse(data['_body']);

                validation_alert.dismiss();

                const alert = this.alertCtrl.create({
                  title: 'Success',
                  subTitle: 'Your debit has been waived.',
                  buttons: [
                    {
                      text: 'Close',
                      handler: () => {
                        this.debitList = [];
                      }
                    }
                  ]
                });
                alert.present();
                
              }, error => {
                console.log(error['_body']);
              });
            }
          }
        ]
      });
      validation_alert.present();

    });
  }

}
