import { AuthService } from '../..//services/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonApiService } from '../..//services/common-api.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPage implements OnInit {
  submitForm: FormGroup;
  apiresponse: any;

  userid: any;
  role: any;
  username: any;

  passwordType = 'password';
  passwordShown = false;

  constructor(private _router: Router, private _fb: FormBuilder,
    private _authservice: AuthService, private _cdr: ChangeDetectorRef,
    private _commonApiService: CommonApiService,
    ) { }

  ngOnInit() {
    this.submitForm = this._fb.group({
      'phonenumber': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });
  }


  signUp() {
    this._router.navigateByUrl('sign-up');
  }

  onClick() {
    this._router.navigateByUrl('survey-mode-start');
  }

  signIn() {

    this._commonApiService.signIn(this.submitForm.value).subscribe(data => {
      this.apiresponse = data;

      if (this.apiresponse.result === 'OK') {
        this.userid = this.apiresponse.userid;
        this.role = this.apiresponse.role;
        this.username = this.apiresponse.username;
   
        this._authservice.loginNotify(this.userid, this.username);
        this._router.navigateByUrl(`/dashboard/${this.userid}`);
        this._cdr.markForCheck();
      }

    });

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
