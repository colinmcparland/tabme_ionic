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
 * Generated class for the PaybackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-payback',
  templateUrl: 'payback.html',
})
export class PaybackPage {

	private debitList: any;
	private fetchDebitsComplete: boolean;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public http: Http, public formBuilder: FormBuilder) {

  		this.fetchDebitsComplete = false;
  		this.getDebitList();

  	}

 	ionViewDidLoad() {
    	console.log('ionViewDidLoad PaybackPage');
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
    	  this.http.get("http://tabme.tinybird.ca/api/debit/owing/" + val[2], options)
    	      .subscribe(data => {
	
    	    //  Parse the response into an array
    	    var resp = JSON.parse(data['_body']);
	
    	    console.log(resp);
	
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

  	payBack(debit) {
		//  Get variables
		console.log(debit);
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
		    id: debit['debit_id']
		  }
    	    
    	  // Make the request
    	  this.http.post("http://tabme.tinybird.ca/api/debit/payback", JSON.stringify(postParams), options)
    	      .subscribe(data => {
	
    	    //  Parse the response into an array
    	    var resp = JSON.parse(data['_body']);
	
    	    console.log(resp);
	
    	    //  If the status code is 200 move to dashboard and start session
    	    if(resp.status == '200') {
    	    	    	
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
