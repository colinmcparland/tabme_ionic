import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Stripe } from '@ionic-native/stripe';

declare const networkinterface;

/**
 * Generated class for the PaymentsetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-paymentsetup',
  templateUrl: 'paymentsetup.html',
})
export class PaymentsetupPage {

  private bankinfo: FormGroup;
  private stateprovlist: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private formBuilder: FormBuilder, private stripe: Stripe, public storage: Storage, public http: Http) {

  	this.bankinfo = this.formBuilder.group({
  		account: ['', Validators.required],
  		transit: ['', Validators.required],
  		institution: ['', Validators.required],
  		country: ['', Validators.required],
  		fname: ['', Validators.required],
  		lname: ['', Validators.required],
  		city: ['', Validators.required],
  		stateprov: ['', Validators.required],
  		address: ['', Validators.required],
  		dob: ['', Validators.required],
  		zip: ['', Validators.required],
  	});

  	this.stateprovlist = ["BC","ON","NL","NS","PE","NB","QC","MB","SK","AB","NT","NU","YT",'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];


  }

  ionViewDidLoad() {
    this.viewCtrl.showBackButton(false);
  }


	getToken() {

		this.stripe.setPublishableKey('pk_live_ED6VDClDIU0wmckUOaveAV2R');

		var currency = '';
		
		if(this.bankinfo.value.country == 'CA') {
			currency = 'CAD';
		}
		else {
			currency = 'USD';
		}
	
		let bank = {
			account_number: this.bankinfo.value.account,
			routing_number: this.bankinfo.value.transit + '-' + this.bankinfo.value.institution,
			account_holder_name: this.bankinfo.value.fname + ' ' + this.bankinfo.value.lname,
			country: this.bankinfo.value.country,
			currency: currency,
			account_holder_type: 'individual',
		};

		/*  TODO:  CC Validation and error messages  */
	
		this.stripe.createBankAccountToken(bank)
			.then(token => this.setToken(token))
			.catch(error => console.log(error['_body']));

	}


	setToken(new_bank_token) {

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
			let form = this.bankinfo.value;

			let year = form.dob.split('-')[0];
			let month = form.dob.split('-')[1];
			let day = form.dob.split('-')[2];
			let ip = '';
			var that = this;

			networkinterface.getIPAddress(function (this_ip) { 
				let postParams = {
				  token: new_bank_token,
				  user_id: val[2],
				  country: form.country,
				  address: form.address,
				  zip: form.zip,
				  dob_month: month,
				  dob_year: year,
				  dob_day: day,
				  fname: form.fname,
				  lname: form.lname,
				  ip: this_ip
				}
				
				// Make the request
				that.http.post("http://tabme.tinybird.ca/api/user/banktoken", JSON.stringify(postParams), options)
				  .subscribe(data => {

				    //  Parse the response into an array
				    var resp = JSON.parse(data['_body']);

				    console.log(resp);

				    //  If the status code is 200 move to dashboard and start session
				    if(resp.status == '200') {
				      	that.navCtrl.push(DashboardPage);
				    }
				}, error => {
				  console.log(error['_body']);
				});
			});
		});
		
	}
}
