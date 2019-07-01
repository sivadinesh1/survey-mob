
import { imageUrl } from './../../../environments/environment';
import { SharedService } from './../../services/shared.service';
import { LoadingService } from './../../services/loading.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { AlertController, Platform } from '@ionic/angular';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonApiService } from '../../services/common-api.service';

import { TranslateConfigService } from './../../services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-survey-mode',
  templateUrl: './survey-mode.page.html',
  styleUrls: ['./survey-mode.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyModePage implements OnInit {

  paramsSubscription: Subscription;
  surveydata: any;
  result: any;
  qnprogress: number;
  newresult: any;
  userinfo: any;

  currentquestion: any;

  keysArr = [];

  addIndex = 0;
  endsurvey = false;
  surveyid: any;
  loggedinUserId: any;

  surveycode: any;

  feedback = {} as IFeedback;

  feedbackArr = [];

  apiresponsedata: any;
  guestname: any;
  animationState: string;
  totalquestions = 0;

  currentCompany: any;
  showother = false;
  submitForm: FormGroup;
  showprev = false;
  showdone = false;

  minoneoptionchosen = false;
  responsemsg: any;
  selectedoptionArr = [];
  showcontactsection = false;
  needcontactdetails: any;
  company_logo: any;
  survey_industry: any;
  guestorcustomer: any;

  PHONE_REGEX = /^[6-9]\d{9}$/;
  validateAllFormFields = SharedService.validateAllFormFields;

  surveyLanguage: any;

  imageUrl = imageUrl;

  surveyresponseid: any;

  test: any;

  constructor(private _route: ActivatedRoute, private _router: Router, private _commonApiService: CommonApiService,
    private _authService: AuthService, private alertController: AlertController,
    private _fb: FormBuilder, private _loadingservice: LoadingService,
    private platform: Platform, private translateConfigService: TranslateConfigService,
    private translate: TranslateService,
    private _cdr: ChangeDetectorRef) {
    this.selectedoptionArr = [];
    this.surveyLanguage = this.translateConfigService.getDefaultLanguage();
  }

  ngOnInit() {

    this.submitForm = this._fb.group({
      // guestname: new FormControl(null, Validators.required),
      // questionid: new FormControl(null, Validators.required),
      // optionid: new FormControl(null, Validators.required),
      surveyid: new FormControl(null, Validators.required),
      otherresponse: new FormControl(null),

      name: new FormControl(null),
      phone: new FormControl(null, Validators.pattern(this.PHONE_REGEX)),


    });

  }


  ionViewDidEnter() {

    this.responsemsg = '';

    this.qnprogress = 0;
    this.result = [];
    this.totalquestions = 0;
    this.addIndex = 0;
    this.selectedoptionArr = [];

    this.paramsSubscription = this._route.data.subscribe(data => {
      this.surveydata = data['surveydata'];

      const array = this.surveydata;

      this.surveyid = array[0].surveyid;
      this.surveycode = array[0].surveycode;

      this.needcontactdetails = array[0].needcontactdetails;

      this.result = array.reduce(function (list, el) {
        if (!list[el.question]) {
          list[el.question] = [];
        }
        list[el.question].push(el);
        return list;
      }, {});

      this.keysArr = Object.keys(this.result);
      this.totalquestions = Object.keys(this.result).length;


      this.surveyLanguage = array[0].survey_language;
      this.company_logo = array[0].surveypicture;
      this.survey_industry = array[0].survey_industry;



      if (this.survey_industry === 'Catering') {
        this.guestorcustomer = 'guest';
      } else {
        this.guestorcustomer = 'customer';
      }

      this.translateConfigService.setLanguage(this.surveyLanguage);

    });
    this.guestname = Math.random().toString(36).slice(2);
    this._cdr.markForCheck();
    this.getAsyncData();
  }

  async getAsyncData() {
    this.loggedinUserId = await <any>this._authService.getItems('USER_ID');

    this._commonApiService.getUserInfo(this.surveyid).subscribe(sdata => {
      this.userinfo = sdata[0];

      this._cdr.markForCheck();
    });


  }


  onClick(item, index) {

    this.responsemsg = '';

    this.feedback.optionid = item.optionid;
    this.feedback.surveyid = item.surveyid;
    this.feedback.questionid = item.questionid;
  //  this.feedback.guestname = this.guestname;
    this.feedback.otherresponse = this.submitForm.value.otherresponse;

    this.currentCompany = item.optionid;

    this.feedback.selectedoptionid = item.optionid;
    this.selectedoptionArr[index] = item.optionid;



    const arr2 = Object.assign({}, this.feedback);
    this.feedbackArr[index] = arr2;



    if (item.res_options === 'Other') {
      this.showother = true;
    } else {
      this.showother = false;
      this.submitForm.patchValue({
        otherresponse: null,
      });

    }

    this.minoneoptionchosen = true;
  }

  prev() {
    this.showother = false;
    this.addIndex = this.addIndex - 1;

    if (this.addIndex === 0) {
      this.showprev = false;
    }
    this.minoneoptionchosen = true;
    this.showdone = false;
// debugger;
// item1.optionid === this.selectedoptionArr[addIndex]

let id__ = this.selectedoptionArr[this.addIndex];

let list = this.result[this.keysArr[this.addIndex]];

let ss = this.feedbackArr[this.addIndex];

list.forEach(element => {
  if ((element.optionid === id__) && (element.res_options === 'Other')) {
    this.showother = true;

    this.submitForm.patchValue({
      otherresponse: this.feedbackArr[this.addIndex].otherresponse,
    });
    return;
  }
});

    // if (this.result[this.keysArr[this.addIndex]].res_options === 'Other') {
    //   this.showother = true;
    // } else {
    //   this.showother = false;
    // }

  }

  next(nIndex) {

    console.log('object .... ' + JSON.stringify(this.selectedoptionArr[nIndex]));

    if (this.selectedoptionArr[nIndex] !== undefined) {
      this.minoneoptionchosen = true;

      if (this.showother === true) {
        if (this.submitForm.value.otherresponse === null) {

          this._loadingservice.presentToastWithPos(this.translate.instant('SURVEY_MODE.enter_feedback_missing'), 'middle');
          this._cdr.markForCheck();
          return;
        } else {
          // debugger;
   

          this.feedbackArr[this.addIndex].otherresponse = this.submitForm.value.otherresponse;
          
          this.submitForm.patchValue({
            otherresponse: null,
          });

          
        }
      } else {
        this.feedbackArr[this.addIndex].otherresponse = null;
      }
    }

    if (this.minoneoptionchosen === true) {

      if (this.selectedoptionArr[nIndex].length > 0) {
        console.log('WHAT.. ');
      }


      this.responsemsg = '';
      this.showother = false;

      this.addIndex = this.addIndex + 1;

      this.showprev = true;
      this.minoneoptionchosen = false;

      if (this.needcontactdetails === 'Y') {

        if (this.addIndex === this.totalquestions) {

          this.showdone = true;
          this.showother = false;
          this.minoneoptionchosen = false;

          this.showcontactsection = true;
          this._cdr.markForCheck();

        }

      } else {
        if (this.addIndex === (this.totalquestions - 1)) {

          this.showdone = true;
          this.showother = false;
          this.minoneoptionchosen = false;
          this._cdr.markForCheck();
        }
      }


    } else {

      this._loadingservice.presentToastWithPos(this.translate.instant('SURVEY_MODE.choose_answer'), 'middle');
      this._cdr.markForCheck();
    }
  }

  async done(nIndex) {

    if (this.selectedoptionArr[nIndex] !== undefined) {
      this.minoneoptionchosen = true;
    }

    if (this.needcontactdetails === 'Y') {

      if (this.submitForm.value.name === null) {

        this._loadingservice.presentToastWithPos(this.translate.instant('SURVEY_MODE.enter_name'), 'middle');

        this._cdr.markForCheck();
        return;

      } else if (this.submitForm.value.phone === null) {

        this._loadingservice.presentToastWithPos(this.translate.instant('SURVEY_MODE.enter_phone'), 'middle');

        this._cdr.markForCheck();
        return;
      }

      if (this.submitForm.value.name !== null && this.submitForm.value.phone !== null) {

        if (this.submitForm.get('phone').invalid === true) {

          this._loadingservice.presentToastWithPos(this.translate.instant('ALERT.no_phone'), 'middle');
          return;
        }

        this.minoneoptionchosen = true;
// debugger;

        // this.feedbackArr.forEach(element => {
        //   element.guestname = this.submitForm.value.name;
        //   element.guestphone = this.submitForm.value.phone;
        // });
        

      }
    }

    if (this.minoneoptionchosen === true) {

      if (this.needcontactdetails === 'N') {

        // this.feedbackArr.forEach(element => {

        //   element.guestphone = null;
        // });
      }

      // this.httpClient.post(`${this.restApiUrl}/api/add-response`, this.feedbackArr).toPromise().then(data => {
      //      this.apiresponsedata = data;
      //      this._cdr.markForCheck();
      //    });


      this.submitForm.patchValue({
        surveyid: this.surveyid,
      });

      console.log('KKJK ' + this.feedbackArr);

      let surveyresponseid =  await this._commonApiService.addSurveyResponse(this.submitForm.value).toPromise();

      this.test = surveyresponseid;

        this.feedbackArr.forEach(element => {

          element.surveyresponseid = this.test.newsurveyresponsesid;
        });

  
debugger;

        this._commonApiService.addResponse(this.feedbackArr).toPromise().then(data => {
          this.apiresponsedata = data;
          this._cdr.markForCheck();
        });





    

      this._cdr.markForCheck();
      if (this.needcontactdetails === 'Y') {

        if (this.addIndex === (this.totalquestions)) {

          this.showdone = false;
          this.showprev = false;
          this.endsurvey = true;
          this.submitForm.reset();
          this.showother = false;
          this.feedback = {};
          this.currentCompany = '';
          this.minoneoptionchosen = false;
          this.selectedoptionArr = [];
          this.feedbackArr = [];

          this.showcontactsection = false;
          this._cdr.markForCheck();
        }

      } else {

        if (this.addIndex === (this.totalquestions - 1)) {


          this.showdone = false;
          this.showprev = false;
          this.endsurvey = true;
          this.submitForm.reset();
          this.showother = false;
          this.feedback = {};
          this.currentCompany = '';
          this.minoneoptionchosen = false;
          this.selectedoptionArr = [];
          this.feedbackArr = [];

          this._cdr.markForCheck();
        }

      }


    } else {

      this._loadingservice.presentToastWithPos(this.translate.instant('SURVEY_MODE.choose_answer'), 'middle');
      this._cdr.markForCheck();
    }

  }

  addRespondentsContact() {
    this.endsurvey = true;


  }

  close() {
    this.presentAlertConfirm();
  }
  async presentAlertConfirm() {

    const alert = await this.alertController.create({
      header: this.translate.instant('ALERT.confirm'),

      message: this.translate.instant('SURVEY_MODE.choose_answer'),
      buttons: [
        {
          text: this.translate.instant('ALERT.cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.translate.instant('ALERT.okay'),
          handler: () => {
            console.log('Confirm Okay');
            this._router.navigateByUrl(`/sign-in`);
          }
        }
      ]
    });

    await alert.present();
  }


  stop() {
    this.qnprogress = 0;
    this.result = [];
    this.totalquestions = 0;
    this.addIndex = 0;
    this.endsurvey = false;
    this._router.navigateByUrl(`/sign-in`);
  }

  newGuest() {
    this.qnprogress = 0;

    this.totalquestions = 0;
    this.addIndex = 0;
    this.endsurvey = false;

    const array = this.surveydata;


    this.surveyid = array[0].surveyid;
    this.surveycode = array[0].surveycode;

    this.result = array.reduce(function (list, el) {
      if (!list[el.question]) {
        list[el.question] = [];
      }
      list[el.question].push(el);
      return list;
    }, {});

    this.keysArr = Reflect.ownKeys(this.result);

    this.totalquestions = Reflect.ownKeys(this.result).length;



    this.guestname = Math.random().toString(36).slice(2);

    this._router.navigateByUrl(`/survey-mode/${this.surveycode}`);
  }

}

