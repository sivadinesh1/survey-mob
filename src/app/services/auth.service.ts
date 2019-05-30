
import { Injectable,  } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { environment, restApiUrl } from '../../environments/environment';

import { Observable, BehaviorSubject, fromEvent, merge, of, Subject } from 'rxjs';

import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root',
  })
export class AuthService {
  restApiUrl = restApiUrl;

    online$: Observable<boolean>;

    authenticationState = new Subject();

    userRole = new Subject();
    loggedinUser = new Subject();

    companyId = new Subject();
    companyName = new Subject();

    
    companylist = [];

   private checklogin =  new BehaviorSubject<boolean>(false);
   cast = this.checklogin.asObservable();

   private userlogged = new BehaviorSubject<string>('');
   usercast = this.userlogged.asObservable();

   signup = {name: '', companyname: '', password: '', phonenumber: ''};

    constructor(private _httpclient: HttpClient, private storage: Storage,
    ) {

    }

    getItems(key): Promise<string> {
      return this.storage.get(key);
    }

    setSignupData(name, companyname, password, phonenumber) {
      this.signup.name = name;
      this.signup.companyname = companyname;
      this.signup.password = password;
      this.signup.phonenumber = phonenumber;

    }

    getSignupData() {
      return this.signup;
    }

    setLoginTrue() {
        console.log('is in userlogged in set XXX');
        this.checklogin.next(true);
    }

    setLoginFalse() {
        console.log('is in userlogged in set XXX');
        this.checklogin.next(false);
    }


    updatePassword(phonenumber: any, password: any) {
      return this._httpclient.get(`${this.restApiUrl}/api/update-password/${phonenumber}/${password}`);
    }



  async logout() {


    await this.storage.remove('USER_ID');
    await this.storage.remove('USER_NAME');
    await this.storage.remove('USER_ROLE');
    await this.storage.remove('AUTHENTICATED');
    await this.storage.remove('COMPANY_ID');

    this.authenticationState.next(false);
    this.userRole.next('');
    this.loggedinUser.next('');
    this.companyId.next('');
    this.companyName.next('');

  }

      async loginNotify(userid, username, companyid, companyname) {

        await this.storage.set('USER_ID', userid);
        await this.storage.set('USER_NAME', username);
        await this.storage.set('AUTHENTICATED', true);
        await this.storage.set('COMPANY_ID', companyid);
        await this.storage.set('COMPANY_NAME', companyname);

          console.log('inside login notify');
          this.loggedinUser.next(username);
          this.companyId.next(companyid);
          this.companyName.next(companyname);
      }

}
