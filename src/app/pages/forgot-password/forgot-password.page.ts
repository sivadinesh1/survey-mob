import { CommonApiService } from './../../services/common-api.service';
import { AuthService } from 'src/app/services/auth.service';


import { LoadingService } from 'src/app/services/loading.service';
import { Router } from '@angular/router';

import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { patternValidator } from 'src/app/utils/pattern-validator';
import { MustMatch } from 'src/app/utils/must-match.validator';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordPage implements OnInit {
  @ViewChild('f') recoverForm: NgForm;

  submitForm: FormGroup;

  recoverauth: string;
  emailsent = false;
  responsemsg: any;
  apiresponse: any;
  recoverphonenumber: any;

  usernotfound: any;
  passwordType = 'password';
  passwordShown = false;

  memberdata: any;
  PASS_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})/;
  PHONE_REGEX = /^[6-9]\d{9}$/;

  constructor(private _authservice: AuthService, private _fb: FormBuilder,
    private _loadingservice: LoadingService, private _commonApiService: CommonApiService,
    private _cdr: ChangeDetectorRef, private _router: Router) { }

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

  goBack() {
    this._router.navigateByUrl('/login');
  }

  onSubmit() {
      this.recoverphonenumber = this.submitForm.value.phonenumber;

      this._commonApiService.getUser(this.recoverphonenumber).subscribe(
        data => {
          this.apiresponse = data;
          console.log('dinesh apiresponse > ' + JSON.stringify(this.apiresponse ));

          if (this.apiresponse.result === 'NO-USER') {
            this._loadingservice.presentToastWithOptions('User Details not found for this Phone Number ', 'middle', false, '');
          } else {
            const userobj = this.apiresponse;







            
            this._router.navigateByUrl('/verify-otp/' + userobj.id);
          }
          this._cdr.markForCheck();
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

}
