declare var Card: any;

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import 'card/dist/card.js';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public formBuilder: FormBuilder, private stripe: Stripe) {
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
	    // a selector or DOM element for the form where users will
	    // be entering their information
	    form: '.ccform', // *required*
	    // a selector or DOM element for the container
	    // where you want the card to appear
	    container: '.card-wrapper', // *required*,
	    width: 300,
	    debug: true // optional - default false
	});
  }


  getToken() {
  	this.stripe.setPublishableKey('pk_live_ED6VDClDIU0wmckUOaveAV2R');

  	let card = {
		number: this.ccinfo.value.number,
		expMonth: this.ccinfo.value.expiry.split('/')[0],
		expYear: this.ccinfo.value.expiry.split('/')[1],
		cvc: this.ccinfo.value.cvc
	};

	this.stripe.createCardToken(card)
	   .then(token => console.log(token.id))
	   .catch(error => console.error(error));
	}

}
