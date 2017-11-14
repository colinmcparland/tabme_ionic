import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgModule, ErrorHandler } from '@angular/core';
import 'rxjs/add/operator/map';
import { AlertController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { DashboardPage } from '../dashboard/dashboard';
import { PaymentsetupPage } from '../paymentsetup/paymentsetup';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  /**
   * Declare variables
   */
  private signup : FormGroup;
  private loginPage: any;
  private loading: any;

  /*  TODO:  Add alert for errors  */
  /**
   * Build this page instance.
   * @param {NavController}   public  navCtrl      Navigation controller
   * @param {Http}            public  http         HTTP library for performing POST request
   * @param {FormBuilder}     private formBuilder  FormBuilder library to parse and validate form
   * @param {AlertController} private alertCtrl    Alert controller for showing error messages etc.
   */
  constructor(public navCtrl: NavController, public http: Http, private formBuilder: FormBuilder, private alertCtrl: AlertController, public storage: Storage, public loadingCtrl: LoadingController) {

    //  Set attributes
    this.loginPage = LoginPage;

    this.loading = this.startLoading();

    this.signup = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  /**
   * Function to check session status
   */
  ionViewWillEnter() {
    var this_alias = this;

    this.storage.get('access_token').then((res) => { 
      if(res != null) {
        this_alias.navCtrl.push(DashboardPage);
      }
      else {

      }
    });
    
  }

  /**
   *  Functiion to start the loading icon up.
   */
  startLoading()  {
    let loading = this.loadingCtrl.create({});
    return loading;
  }

  /**
   * Function for front end to hook into to perform POST request to the server
   */
  postRequest() {

  	// Set the headers and put them into a Requestoptions object
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');

    let options = new RequestOptions({ headers: headers });
 
 	  // Set the arguments for the POST request
    // TODO:  hash PW
    let postParams = {
      email: this.signup.value.email,
      password: this.signup.value.password
    }

    //  Start loading
    let loading = this.startLoading();

    this.loading.present();
    
    // Make the request
    this.http.post("http://tabme.tinybird.ca/api/user/create", JSON.stringify(postParams), options)
      .subscribe(data => {
        //  Parse the response into an array
        var resp = JSON.parse(data['_body']);
        console.log(resp);

        //  Stop loading
        this.loading.dismiss();

        //  If the status code is 200 move to dashboard and start session
        if(resp.status == '200') {
          //  Write session data
          Promise.all([
            this.storage.set('email', postParams.email),
            this.storage.set('id', resp.content.id),
            this.storage.set('access_token', resp.access_token),
            this.storage.set('refresh_token', resp.refresh_token)
          ]).then(val => {
            // this.navCtrl.push(PaymentsetupPage);
            this.navCtrl.push(DashboardPage);
          });
          
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
  }

}
