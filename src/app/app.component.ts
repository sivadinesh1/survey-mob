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
  companyId: any;
  companyname: any;

  public appPages = [
    {title: 'Settings', url: '/', icon: '/assets/images/settings.svg'},
    {title: 'View Members', url: '', icon: '/assets/images/group.svg'},
    {title: 'View Companies', url: '', icon: '/assets/images/factory.svg'},
    {title: 'Signout', url: '/', icon: '/assets/images/logout.svg'}
  ];

  constructor(
    private platform: Platform, private _cdr: ChangeDetectorRef,
    private splashScreen: SplashScreen, private _router: Router,
    private statusBar: StatusBar, private _authService: AuthService,
  ) {
    this.initializeApp();

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

      this._authService.companyName.subscribe(companydata => {
        this.companyname = companydata;
        console.log('object....' + this.companyname);
       
        this._cdr.markForCheck();
      });

      this.getAsyncData();

    });
  }
  ionViewDidEnter() {
    this.getAsyncData();
  }

  async getAsyncData() {

    this.loggedinUserId = await <any>this._authService.getItems('USER_ID');
    this.username = await <any>this._authService.getItems('USER_NAME');
    this.companyId = await <any>this._authService.getItems('COMPANY_ID');

    console.log('usernameobject' + this.username);
    console.log('loggedinUserId' + this.loggedinUserId);

    console.log('companyId' + this.companyId);

    this.appPages[1].url = `/list-member/${this.companyId}`;
    this.appPages[2].url = `/list-company/${this.loggedinUserId}`;

   
    this._cdr.markForCheck();
    
  }

  onClick(item: any) {

    if (item.title === 'Signout') {
      this._authService.logout();
      this._router.navigateByUrl('/sign-in');
    }

  }

}
 