
import { AuthService } from './../../services/auth.service';
import { LoadingService } from './../../services/loading.service';
import { CommonApiService } from './../../services/common-api.service';

import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-survey-mode-start',
  templateUrl: './survey-mode-start.page.html',
  styleUrls: ['./survey-mode-start.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyModeStartPage implements OnInit {
  verifyForm: FormGroup;
  submitForm: FormGroup;

  apiresponse: any;
  otpsent = false;
  otpsendstatus: any;
  otpstatus: any;
  lastdigits: any;

  responsemsg: any;

  duplicatephone = false;

  constructor(private _router: Router, private _cdr: ChangeDetectorRef,
    private storage: Storage,
    private _authservice: AuthService,
    private _fb: FormBuilder, private _loadingservice: LoadingService,
    private _commonApiService: CommonApiService) { }

  ngOnInit() {

    this.submitForm = this._fb.group({
      surveycode: new FormControl(null),

    });


  }



  onSubmit() {

    const surveycode = this.submitForm.value.surveycode;
   
    this._commonApiService.checkValidSurveyCode(surveycode).subscribe(data => {
      this.apiresponse = data;
      console.log('object' + JSON.stringify(this.apiresponse));

      if (this.apiresponse[0].count === 0) {
        this.responsemsg = 'Is this a Valid Live survey code?.';
      } else if (this.apiresponse[0].count === 1) {
        this._router.navigateByUrl(`/survey-mode/${surveycode}`);
      } else {
        this.responsemsg = 'duplicaet survey codes. Contact Admin.';
      }


      this._cdr.markForCheck();
    });
  }

  signin() {
    this._router.navigateByUrl('/sign-in');
  }

}


