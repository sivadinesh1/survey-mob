


import { Subscription } from 'rxjs';
import { CommonApiService } from 'src/app/services/common-api.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import {  FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Storage } from '@ionic/storage';

import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth.service';
import { patternValidator } from 'src/app/utils/pattern-validator';
import { MustMatch } from 'src/app/utils/must-match.validator';

@Component({
  selector: 'app-reset-temp-password',
  templateUrl: './reset-temp-password.page.html',
  styleUrls: ['./reset-temp-password.page.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None

})
export class ResetTempPasswordPage implements OnInit {

    apiresponse: any;
  // submitForm: FormGroup;
  loggedIn: boolean;
  responsemsg: any;
  errormsg: any;

  res: any;

  loged = false;
  token: any;
  navurl: any;
  otpstatus: any;
  memberdata: any;

  loginform = [
    {
      username: '',
      password: '',
      source: '',

    }
  ];

  @ViewChild('p1') p1;
  @ViewChild('p2') p2;
  @ViewChild('p3') p3;
  @ViewChild('p4') p4;
  @ViewChild('p5') p5;
  @ViewChild('p6') p6;


  submitForm: FormGroup;
  verifyForm: FormGroup;

  newpassword: string;

  otpsent: any;
  otpsendstatus: any;
  phonenumber: any;
  PASS_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;

  
  lastdigits: any;
  paramsSubscription: Subscription;

  passwordType = 'password';
  passwordShown = false;

  constructor(private _authservice: AuthService, private _fb: FormBuilder, private _location: Location,
    private storage: Storage, private _router: Router, private _commonapiservice: CommonApiService,
    private _route: ActivatedRoute, private _loadingservice: LoadingService,
    private _cdr: ChangeDetectorRef) {

     }

    ngOnInit() {



      this.paramsSubscription = this._route.data.subscribe(data => {
        this.memberdata = data['memberdata'];
      });

      console.log('+++++++++++++' + JSON.stringify(this.memberdata));

      console.log('+++++++++++++' + this.memberdata.phone);
      this.phonenumber = this.memberdata.phone;
      this.lastdigits = this.phonenumber.substring(this.phonenumber.length, this.phonenumber.length - 2);


      this.submitForm = this._fb.group({
        // 'password': new FormControl(null, [Validators.required, Validators.minLength(6),
        //   Validators.maxLength(12), Validators.pattern(this.PASS_REGEX)]),

         'password': new FormControl(null, [Validators.required, Validators.minLength(6),
           patternValidator(this.PASS_REGEX)]),
          'confirmPassword': new FormControl(null, [Validators.required]),

      }, {
        validator: MustMatch
       });

      this.verifyForm = this._fb.group({
        'p1': new FormControl(null ),
        'p2': new FormControl(null ),
        'p3': new FormControl(null ),
        'p4': new FormControl(null ),
        'p5': new FormControl(null ),
        'p6': new FormControl(null ),

      });
   }

//    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
//    const pass = group.controls.password.value;
//    const confirmPass = group.controls.confirmPassword.value;

//    return pass === confirmPass ? null : { notSame: true };
//  }



  getOTPSession(): Promise<string> {
    return this.storage.get('otpsessionid');
 }

 async onVerifyOTP() {
this._loadingservice.present();
 

   // tslint:disable-next-line:max-line-length
   const otpentered = `${this.verifyForm.value.p1}${this.verifyForm.value.p2}${this.verifyForm.value.p3}${this.verifyForm.value.p4}${this.verifyForm.value.p5}${this.verifyForm.value.p6}`

   console.log('print otpentered  >' + otpentered);

   const otpsessionid = await this.getOTPSession();
   console.log('print otpentered  1 >>> ' + otpsessionid);

   this._commonapiservice.verifyOTP(otpsessionid, otpentered).subscribe(
    async data => {
      this.apiresponse = data;
      console.log('adfas>> ' + JSON.stringify(this.apiresponse));

      if (this.apiresponse.message === 'SUCCESS') {
        this.otpsent = true;
        this.otpsendstatus = '';
        this._loadingservice.dismiss();
        if (this.apiresponse.obj.details === 'OTP Matched' ) {
          this.otpstatus = 'OTP Verification Successful.';
          console.log('dine ...... 1 >>'  + this.newpassword);
          console.log('dine ...... 11 >>'  + this.memberdata.userId);
          this._authservice.updatePassword(this.memberdata.userId, this.newpassword ).subscribe();
          console.log('dine ...... 2 >>');

          this._loadingservice.presentToastWithOptions('OTP Verification Successful.', 'middle', false, '');
          console.log('dine ...... 3 >>');

            console.log('dine ...... 4 >>');

            // this._authservice.loginNotify(this.userid, this.username);
            // this._router.navigateByUrl(`/dashboard/${this.userid}`);
            this._cdr.markForCheck();

            this._cdr.markForCheck();
            this._cdr.markForCheck();

        }



      } else if (this.apiresponse.message === 'ERROR') {
        this.otpstatus = 'OTP Verification Failed.';
        this._loadingservice.dismiss();
        this._loadingservice.presentToastWithOptions('OTP Verification Failed.', 'middle', false, '');
        this._cdr.markForCheck();
       return false;
      }

      this._cdr.markForCheck();
    },
    error => console.error(error)
  );

 }



moveOnMax (nextFieldID) {
  this._cdr.detectChanges();

  if (nextFieldID === 'p1') {
    this.p1.nativeElement.focus();
  } else if (nextFieldID === 'p2') {
    this.p2.nativeElement.focus();
  } else if (nextFieldID === 'p3') {
    this.p3.nativeElement.focus();
  } else if (nextFieldID === 'p4') {
    this.p4.nativeElement.focus();
  } else if (nextFieldID === 'p5') {
    this.p5.nativeElement.focus();
  } else if (nextFieldID === 'p6') {
    this.p6.nativeElement.focus();
  }

  this._cdr.markForCheck();
}

togglePassword() {
  if (this.passwordShown) {
    this.passwordShown = false;
    this.passwordType = 'password';
  } else {
    this.passwordShown = true;
    this.passwordType = 'text';
  }
}

  onSubmit() {
    console.log('inside. tsssss..' + this.submitForm);
    this._loadingservice.present();
this.newpassword = this.submitForm.value.password;
      this._commonapiservice.sendOTP(this.phonenumber).subscribe(
        data => {
          this.apiresponse = data;
          console.log('adfas>> ' + JSON.stringify(this.apiresponse));
          console.log('sdsd>>>>>>' + this.apiresponse.body.message);

          if (this.apiresponse.body.message === 'SUCCESS') {
            this.storage.set('otpsessionid', this.apiresponse.body.obj.details);

            this.otpsent = true;
            this.otpsendstatus = '';

            console.log('session id >> ' + this.apiresponse.body.obj.details);
            this._loadingservice.dismiss();
            this._cdr.markForCheck();
            console.log('session id >> CLOSED ' );

          } else if (this.apiresponse.body.message === 'ERROR') {
            this._loadingservice.presentToastWithOptions('OTP Not Sent, Check internet Connection', 'middle', false, '');
            this._loadingservice.dismiss();
            this._cdr.markForCheck();
          }


        },
        error => console.error(error)
      );

  }

  goSignup() {
    this._router.navigateByUrl('/register');
  }

  goForgotPassword() {
    this._router.navigateByUrl('/forgot-password');
  }

}


