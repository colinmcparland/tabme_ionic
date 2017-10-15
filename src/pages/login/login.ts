import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgModule, ErrorHandler } from '@angular/core';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  /**
   * Declare variables for this class
   */
  private login : FormGroup;

  /*  TODO:  Add alert for errors  */

  /**
   * Build the instance for this page.  
   * @param {NavController}   public  navCtrl     Navigation controller
   * @param {Http}            public  http        HTTP Library for POST request
   * @param {FormBuilder}     private formBuilder Form Builder library to parse login credentials
   * @param {AlertController} private alertCtrl   Alert controller for error messages, etc..
   */
  constructor(public navCtrl: NavController, public http: Http, private formBuilder: FormBuilder, private alertCtrl: AlertController, public storage: Storage) {
    
    //  Build the login form and validate
    this.login = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }



  /**
   * Function to check session status
   */
  ionViewWillEnter() {
    if(this.storage.get('access_token')) {
      this.navCtrl.push(DashboardPage);
      //  Ping auth server to see if token still valid
      //  If yes, skip to dashboard
      //  If no, try refresh token
      //  If still no, redirect to login page
    }
  }

  /**
   * Function that the login form will hook into in order to validate a user.
   */
  postRequest() {

  	// Set the headers
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');

    //  Create variable to pass into funciton later.
    let options = new RequestOptions({ headers: headers });
 
 	  // Set the POST data
    // TODO:  Hash password
    let postParams = {
      email: this.login.value.email,
      password: this.login.value.password
    }
    
    // Make the request
    this.http.post("http://tabme.tinybird.ca/api/user/validate", JSON.stringify(postParams), options)
      .subscribe(data => {

        //  Parse the response into an array
        var resp = JSON.parse(data['_body']);

        //  If the status code is 200 move to dashboard and start session
        if(resp.status == '200') {
          //  Write session data
          this.storage.set('email', postParams.email);
          this.storage.set('pass', postParams.password);
          this.storage.set('access_token', resp.access_token);
          this.storage.set('refresh_token', resp.refresh_token);
          this.navCtrl.push(DashboardPage);
        }
        else {

          //  Error message
           const alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Sorry, we couldn\'t find that email and password combination.  Please try again or create an account.',
            buttons: ['Close']
          });

          alert.present();

        }
       }, error => {
        console.log(error['_body']);
      });
  }

}
