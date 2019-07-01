import { LoadingService } from './../../services/loading.service';
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
  responsemsg: any;

  userid: any;
  role: any;
  username: any;

  passwordType = 'password';
  passwordShown = false;

  constructor(private _router: Router, private _fb: FormBuilder, private _loadingservice: LoadingService,
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
// debugger;


      if (this.apiresponse.result === 'OK' && this.apiresponse.data.length >= 1) {

        this.userid = this.apiresponse.data[0].userid;

        this.username = this.apiresponse.data[0].username;
        this.responsemsg = '';

        const companyArr = this.apiresponse.data;
        this._authservice.companylist = [];

        companyArr.forEach(element => {
          
          this._authservice.companylist.push({'id': element.company_id, 'name': element.company_name});
        });
        this._cdr.markForCheck();

        this._authservice.loginNotify(this.userid, this.username,
          this.apiresponse.data[0].company_id, this.apiresponse.data[0].company_name);
        // this._router.navigateByUrl(`/dashboard/${this.userid}`);
        this._router.navigateByUrl(`/dashboard/${this.apiresponse.data[0].company_id}`);
        this._cdr.markForCheck();


      // if (this.apiresponse.result === 'OK') {
        // this.userid = this.apiresponse.userid;
        // this.role = this.apiresponse.role;
        // this.username = this.apiresponse.username;
        // this.responsemsg = '';
   
        // this._authservice.loginNotify(this.userid, this.username);
        // this._router.navigateByUrl(`/dashboard/${this.userid}`);
        // this._cdr.markForCheck();
      } else if (this.apiresponse.result === 'NOTOK') {
 //`       this.responsemsg = 'Wrong User / Password (or) not found';
        this._loadingservice.presentToastWithOptions('Wrong User / Password (or) not found', 'middle', false, '');
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
