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

	constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public storage: Storage, private http: Http, public alertCtrl: AlertController) {

	  	this.search = this.formBuilder.group({
	  		email: ['', Validators.required]
	  	});

	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddfriendPage');
  }

 postRequest() {

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
        email: this.search.value.email,
        user_id: val[2]
      }
        
      // Make the request
      this.http.post("http://tabme.tinybird.ca/api/friend/" + this.search.value.email, JSON.stringify(postParams), options)
          .subscribe(data => {

        //  Parse the response into an array
        var resp = JSON.parse(data['_body']);

        //  If the status code is 200 move to dashboard and start session
        if(resp.status == '200') {
          const alert = this.alertCtrl.create({
            title: 'Success',
            subTitle: this.search.value.email + ' has been successfully added as a friend.',
            buttons: ['Close']
          });

          alert.present();
        }
        else {
          //  Error message
          const alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: resp.content,
            buttons: ['Close']
          });

          alert.present();

        }
      }, error => {
        console.log(error['_body']);
      });
    });


  }

}
