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
 * Generated class for the AddfriendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-addfriend',
  templateUrl: 'addfriend.html',
})
export class AddfriendPage {

	private search: FormGroup;

	constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder) {

	  	this.search = this.formBuilder.group({
	  		email: ['', Validators.required]
	  	});

	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddfriendPage');
  }

  postRequest()	{

  }

}
