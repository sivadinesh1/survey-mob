import { AuthService } from './../../services/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { LoadingService } from './../../services/loading.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyOtpPage implements OnInit {
  submitForm: FormGroup;

  @ViewChild('p1') p1;
  @ViewChild('p2') p2;
  @ViewChild('p3') p3;
  @ViewChild('p4') p4;
  @ViewChild('p5') p5;
  @ViewChild('p6') p6;

  apiresponse: any;
  
  otpsendstatus: any;
  otpstatus: any;
  phonenumber: any;
  lastdigits: any;

  resendotpmsg: any;
  loading = true;

  constructor(private _fb: FormBuilder, private _cdr: ChangeDetectorRef,
    private _commonApiService: CommonApiService, private _router: Router,
    private storage: Storage, private _route: ActivatedRoute, private _authservice: AuthService,
    private _loadingservice: LoadingService) { 
      this.phonenumber = this._route.snapshot.paramMap.get('phonenumber');
      this.lastdigits =  this.phonenumber.substring( this.phonenumber.length,  this.phonenumber.length - 2);
    }

  ngOnInit() {
    this.submitForm = this._fb.group({
      'p1': new FormControl(null),
      'p2': new FormControl(null),
      'p3': new FormControl(null),
      'p4': new FormControl(null),
      'p5': new FormControl(null),
      'p6': new FormControl(null),



    });
  }


  async onVerifyOTP() {
    this._loadingservice.present();


    // tslint:disable-next-line:max-line-length
    const otpentered = `${this.submitForm.value.p1}${this.submitForm.value.p2}${this.submitForm.value.p3}${this.submitForm.value.p4}${this.submitForm.value.p5}${this.submitForm.value.p6}`

    console.log('print otpentered  >' + otpentered);

    const otpsessionid = await this.getOTPSession();
    console.log('print otpentered  1 >>> ' + otpsessionid);

    this._commonApiService.verifyOTP(otpsessionid, otpentered).subscribe(
      async data => {
        this.apiresponse = data;
        console.log('adfas>> ' + JSON.stringify(this.apiresponse));

        const resp = JSON.parse(this.apiresponse);


        if (resp.Status === 'Success') {
        
          this.otpsendstatus = '';
          this._loadingservice.dismiss();
          if (resp.Details === 'OTP Matched') {
            console.log('object otp matched..');


const signupdata = this._authservice.getSignupData();
console.log('object>>> ' + JSON.stringify(signupdata));

            this._commonApiService.addUser(signupdata)
            .subscribe(
              data => {
                this.apiresponse = data;
                console.log('object >>> ' + JSON.stringify(this.apiresponse));
        
        
                if (this.apiresponse.result === 'OK') {
                  this.loading = false;
                   const newuserid = this.apiresponse.newuserid;
                   
                   this._authservice.loginNotify(newuserid, signupdata.name, '', '');
        
                  this._router.navigateByUrl(`/new-survey`);
                }
        
              }, error => {
                this.loading = false;
                this._loadingservice.dismiss();
                console.log('error while apply jobs..' );
              }
            );



          //  this._router.navigateByUrl(`/set-profile/${this.phonenumber}`);
          }


          this._cdr.markForCheck();

        } else if (resp.Status === 'Error') {

          if (resp.Details === 'OTP Mismatch') {
            this.otpstatus = 'OTP Verification Failed.';
           
            this._loadingservice.presentToastWithOptions('OTP Verification Failed.', 'middle', false, '');
            this._cdr.markForCheck();
            return false;
          }
        }

        this._cdr.markForCheck();
      },
      error => console.error(error)
    );




  }

  getOTPSession(): Promise<string> {
    return this.storage.get('otpsessionid');
  }


  resendotp() {

    this._commonApiService.sendOTP(this.phonenumber).subscribe(
      data => {
        this.apiresponse = data;

     
          const resp = JSON.parse(this.apiresponse);

          if (resp.Status === 'Success') {
            this.storage.remove('otpsessionid');
            this.storage.set('otpsessionid', resp.Details);

            this.resendotpmsg = 'OTP Resent';
  
            this._loadingservice.dismiss();
            this._cdr.markForCheck();
        
  
          
        }

      },
      error => {
        this._loadingservice.dismiss();
        this._cdr.markForCheck();
        console.error(error);
      }
    );
  }

  moveOnMax(nextFieldID) {
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

}