
import { Injectable,  } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, BehaviorSubject, fromEvent, merge, of, Subject } from 'rxjs';

import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root',
  })
export class AuthService {
  restApiUrl = environment.restApiUrl;

    online$: Observable<boolean>;

    authenticationState = new Subject();

    userRole = new Subject();
    loggedinUser = new Subject();
    
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


   

  async logout() {
   
   
    await this.storage.remove('USER_ID');
    await this.storage.remove('USER_NAME');
    await this.storage.remove('USER_ROLE');
    await this.storage.remove('AUTHENTICATED');

    this.authenticationState.next(false);
    this.userRole.next('');
    this.loggedinUser.next('');
    

  }

      async loginNotify(userid, username) {

        await this.storage.set('USER_ID', userid);
        await this.storage.set('USER_NAME', username);
        await this.storage.set('AUTHENTICATED', true);
          console.log('inside login notify');
          this.loggedinUser.next(username);
      }

}
