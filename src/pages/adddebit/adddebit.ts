import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgModule, ErrorHandler } from '@angular/core';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public http: Http, public formBuilder: FormBuilder) {

  	this.debit = this.formBuilder.group({
		amount: ['', Validators.required],
		debtor: ['', Validators.required]
	});

  	this.fetchFriendsComplete = false;
  	this.fetchDebitsComplete = false;
  	this.getDebitList();
  	this.getFriendsList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdddebitPage');
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
        
      // Make the request
      this.http.post("http://tabme.tinybird.ca/api/debit", JSON.stringify(postParams), options)
          .subscribe(data => {

        //  Parse the response into an array
        var resp = JSON.parse(data['_body']);

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

}
