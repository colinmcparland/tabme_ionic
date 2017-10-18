declare var Card: any;

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import 'card/dist/card.js';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Stripe } from '@ionic-native/stripe';


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
  private stateprovlist: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public formBuilder: FormBuilder, private stripe: Stripe, public storage: Storage, public http: Http) {
  	this.ccinfo = this.formBuilder.group({
  		number: ['', Validators.required],
  		name: ['', Validators.required],
  		cvc: ['', Validators.required],
  		expiry: ['', Validators.required],
  		fname: ['', Validators.required],
  		lname: ['', Validators.required],
  		address: ['', Validators.required],
  		city: ['', Validators.required],
  		stateprov: ['', Validators.required],
  		zip: ['', Validators.required],
  		dob: ['', Validators.required],
  		country: ['', Validators.required],
  	})

  	this.stateprovlist = ["BC","ON","NL","NS","PE","NB","QC","MB","SK","AB","NT","NU","YT",'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
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
		var currency = '';
		if(this.ccinfo.value.country == 'CA') {
			currency = 'CAD';
		}
		else {
			currency = 'USD';
		}
	
		let card = {
			number: this.ccinfo.value.number.replace(" ", ""),
			expMonth: Number(this.ccinfo.value.expiry.split('/')[0]),
			expYear: Number(this.ccinfo.value.expiry.split('/')[1]),
			cvc: this.ccinfo.value.cvc,
			name: this.ccinfo.value.fname + ' ' + this.ccinfo.value.lname,
			address_line1: this.ccinfo.value.address,
			address_city: this.ccinfo.value.city,
			address_state: this.ccinfo.value.stateprov,
			address_country: this.ccinfo.value.country,
			address_zip: this.ccinfo.value.zip,
			currency: currency
		};

		/*  TODO:  CC Validation and error messages  */
	
		this.stripe.createCardToken(card)
			.then(token => this.setToken(token))
			.catch(error => console.log(error));

	}


	setToken(new_cc_token) {

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
			  token: new_cc_token,
			  user_id: val[2],
			  country: this.ccinfo.value.country,
			}
			
			// Make the request
			this.http.post("http://tabme.tinybird.ca/api/user/cctoken", JSON.stringify(postParams), options)
			  .subscribe(data => {

			    //  Parse the response into an array
			    var resp = JSON.parse(data['_body']);
			   	console.log(resp);

			    //  If the status code is 200 move to dashboard and start session
			    if(resp.status == '200') {
			      	this.navCtrl.push(DashboardPage);
			    }
			}, error => {
			  console.log(error['_body']);
			});

		});
		
	}
}
