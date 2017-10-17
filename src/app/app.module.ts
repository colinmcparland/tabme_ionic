import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { AddfriendPage } from '../pages/addfriend/addfriend';
import { AdddebitPage } from '../pages/adddebit/adddebit';
import { PaybackPage } from '../pages/payback/payback';
import { PaymentsetupPage } from '../pages/paymentsetup/paymentsetup';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpModule } from '@angular/http';

import { IonicStorageModule } from '@ionic/storage';
import { Stripe } from '@ionic-native/stripe';

@NgModule({
  declarations: [
    MyApp,
    RegisterPage,
    LoginPage,
    DashboardPage,
    AddfriendPage,
    AdddebitPage,
    PaybackPage,
    PaymentsetupPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RegisterPage,
    LoginPage,
    DashboardPage,
    AddfriendPage,
    AdddebitPage,
    PaybackPage,
    PaymentsetupPage
  ],
  providers: [
    Stripe,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
