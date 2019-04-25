
import { AuthService } from './../../services/auth.service';
import { LoadingService } from './../../services/loading.service';
import { CommonApiService } from './../../services/common-api.service';

import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { patternValidator } from '../../utils/pattern-validator';
import { MustMatch } from '../../utils/must-match.validator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SignUpPage implements OnInit {
  
  submitForm: FormGroup;

  apiresponse: any;
  otpsent = false;
  otpsendstatus: any;
  otpstatus: any;
  lastdigits: any;


  duplicatephone = false;

  PASS_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})/;
  PHONE_REGEX = /^[6-9]\d{9}$/;

  passwordType = 'password';
  passwordShown = false;

  constructor(private _router: Router, private _cdr: ChangeDetectorRef,
    private storage: Storage,
private _authservice: AuthService,
    private _fb: FormBuilder, private _loadingservice: LoadingService,
    private _commonApiService: CommonApiService) { }

  ngOnInit() {

    this.submitForm = this._fb.group({
      
      'phonenumber': new FormControl(null, [Validators.required, Validators.pattern(this.PHONE_REGEX)]),
      firstname: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      companyname: new FormControl(null, [ Validators.maxLength(30)]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6),
        patternValidator(this.PASS_REGEX)]),
       'confirmPassword': new FormControl(null, [Validators.required]),

    }, {
      validator: MustMatch
     });


  }

  setPassword() {
    this._router.navigateByUrl('set-password');
  }


  


  onSubmit() {
    console.log('inside. tsssss..' + this.submitForm.value);
    this._loadingservice.present();

    const phone = this.submitForm.value.phonenumber;

    const name = this.submitForm.value.firstname;
    const companyname = this.submitForm.value.companyname;
    const password = this.submitForm.value.password;


    this._commonApiService.sendOTP(phone).subscribe(
      data => {
        this.apiresponse = data;

        if(this.apiresponse === 'DUPLICATE_PHONO') {
          this.duplicatephone = true;
          this.otpsent = false;
          this.otpsendstatus = 'Phone number is already registered.';
          this._loadingservice.dismiss();
          this._cdr.markForCheck();
        } else {
          const resp = JSON.parse(this.apiresponse);

          if (resp.Status === 'Success') { 
            this.storage.set('otpsessionid', resp.Details);
  
            this._loadingservice.dismiss();

            this._authservice.setSignupData(name, companyname, password, phone );

            this._cdr.markForCheck();
            this._router.navigateByUrl(`verify-otp/${phone}`);
            console.log('session id >> CLOSED ');
  
          }
        }

      },
      error => {
        this._loadingservice.dismiss();
        this._cdr.markForCheck();
        console.error(error);
      }
    );

  }


  togglePassword() {
    console.log('inside toggle');
    if (this.passwordShown) {
      this.passwordShown = false;
      this.passwordType = 'password';
    } else {
      this.passwordShown = true;
      this.passwordType = 'text';
    }
  }

  signin() {
    this._router.navigateByUrl(`/sign-in`);
  }

}
