import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  loggedinUserId: any;
  username: any;

  public appPages = [
    // {
    //   title: 'Home',
    //   url: '/home',
    //   icon: 'home'
    // },
    // {
    //   title: 'List',
    //   url: '/list',
    //   icon: 'list'
    // },
    {
      title: 'Signout',
      url: '/',
      icon: 'log-out'
    }
  ];

  constructor(
    private platform: Platform, private _cdr: ChangeDetectorRef,
    private splashScreen: SplashScreen, private _router: Router,
    private statusBar: StatusBar, private _authService: AuthService,
  ) {
    this.initializeApp();
  //   this._router.routeReuseStrategy.shouldReuseRoute = function() {
  //     return false;
  // };
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this._authService.loggedinUser.subscribe(userdata => {
        this.username = userdata;
        console.log('object....' + this.username);
        console.log('object....' + JSON.stringify(this.username));
        this._cdr.markForCheck();
      });

    });
  }
  ionViewDidEnter() {
    this.getAsyncData();
  }

  async getAsyncData() {

    this.loggedinUserId = await <any>this._authService.getItems('USER_ID');
    this.username = await <any>this._authService.getItems('USER_NAME');
    console.log('usernameobject' + this.username);
    console.log('loggedinUserId' + this.loggedinUserId);

  
    this._cdr.markForCheck();
    
  }

  onClick(item: any) {

    if (item.title === 'Signout') {
      this._authService.logout();
      this._router.navigateByUrl('/sign-in');
    }

  }

}
 