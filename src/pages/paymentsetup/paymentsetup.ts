declare var Card: any;

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import 'card/dist/card.js';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Stripe } from '@ionic-native/stripe';
import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';


/**
 * Generated class for the PaymentsetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paymentsetup',
  templateUrl: 'paymentsetup.html',
})
export class PaymentsetupPage {

  private card: any;
  private ccinfo: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public formBuilder: FormBuilder, private stripe: Stripe, public storage: Storage, public http: Http) {
  	this.ccinfo = this.formBuilder.group({
  		number: ['', Validators.required],
  		name: ['', Validators.required],
  		cvc: ['', Validators.required],
  		expiry: ['', Validators.required]
  	})
  }

  ionViewDidLoad() {
    this.viewCtrl.showBackButton(false);
    this.card = new Card({
	    form: '.ccform', 
	    container: '.card-wrapper', 
	    width: 300,
	    debug: true 
	});
  }


	getToken() {

		this.stripe.setPublishableKey('pk_live_ED6VDClDIU0wmckUOaveAV2R');
	
		let card = {
			number: this.ccinfo.value.number,
			expMonth: Number(this.ccinfo.value.expiry.split('/')[0]),
			expYear: Number(this.ccinfo.value.expiry.split('/')[1]),
			cvc: this.ccinfo.value.cvc
		};
	
		this.stripe.createCardToken(card)
			.then(token => this.setToken(token))
			.catch(error => console.error(error));

	}


	setToken(new_token) {

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
			let options = new RequestOptions({ headers: headers });
			
			// Set the POST data
			// TODO:  Hash password
			let postParams = {
			  token: new_token['id'],  //  THIS IS EMPTY FIX IT
			  user_id: val[2]
			}
			
			// Make the request
			this.http.post("http://tabme.tinybird.ca/api/user/cctoken", JSON.stringify(postParams), options)
			  .subscribe(data => {

			    //  Parse the response into an array
			    var resp = JSON.parse(data['_body']);
			   	console.log(resp);

			    //  If the status code is 200 move to dashboard and start session
			    if(resp.status == '200') {
			      //  Write session data

			      this.storage.set('cc_token', new_token);
			      this.navCtrl.push(DashboardPage);
			    }
			}, error => {
			  console.log(error['_body']);
			});

		});
		
	}
}
