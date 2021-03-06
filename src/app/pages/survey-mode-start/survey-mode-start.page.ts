import { TranslateConfigService } from './../../services/translate-config.service';

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
  
  submitForm: FormGroup;

  apiresponse: any;
  otpsent = false;
  otpsendstatus: any;
  otpstatus: any;
  lastdigits: any;

  responsemsg: any;

  duplicatephone = false;
  selectedLanguage: string;

  constructor(private _router: Router, private _cdr: ChangeDetectorRef,
    private storage: Storage,
    private _authservice: AuthService,
    private _fb: FormBuilder, private _loadingservice: LoadingService,
    private _commonApiService: CommonApiService,
    private translateConfigService: TranslateConfigService,
  ) {
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
  }

  ngOnInit() {

    this.submitForm = this._fb.group({
      surveycode: new FormControl(null),

    });

  }


  languageChanged() {
    this.translateConfigService.setLanguage(this.selectedLanguage);
  }

  ionViewDidEnter() {

    this.submitForm.patchValue({
      surveycode: null
    });

  }

  async onSubmit() {

    const surveycode = this.submitForm.value.surveycode;

    this.apiresponse = await this._commonApiService.checkValidSurveyCode(surveycode).toPromise();
   // this.apiresponse = data;
      console.log('object' + JSON.stringify(this.apiresponse));

      if (this.apiresponse[0].count === 0) {
        this.responsemsg = 'Survey Code not valid. Contact administrator.';
        this._loadingservice.presentToastWithPos(this.responsemsg, 'middle');
        this._cdr.markForCheck();
      } else if (this.apiresponse[0].count === 1) {
        this._router.navigateByUrl(`/survey-mode/${surveycode}`);
      } else {
        this.responsemsg = 'duplicaet survey codes. Contact Admin.';
      }


      this._cdr.markForCheck();
    // this._commonApiService.checkValidSurveyCode(surveycode).subscribe(data => {
    //   this.apiresponse = data;
    //   console.log('object' + JSON.stringify(this.apiresponse));

    //   if (this.apiresponse[0].count === 0) {
    //     this.responsemsg = 'Survey Code not valid. Contact administrator.';
    //     this._loadingservice.presentToastWithPos(this.responsemsg, 'middle');
    //     this._cdr.markForCheck();
    //   } else if (this.apiresponse[0].count === 1) {
    //     this._router.navigateByUrl(`/survey-mode/${surveycode}`);
    //   } else {
    //     this.responsemsg = 'duplicaet survey codes. Contact Admin.';
    //   }


    //   this._cdr.markForCheck();
    // });
  }

  signin() {
    this._router.navigateByUrl('/sign-in');
  }

}


