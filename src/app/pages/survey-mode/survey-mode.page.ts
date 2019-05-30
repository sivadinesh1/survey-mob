import { LoadingService } from './../../services/loading.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


import { AuthService } from '../../services/auth.service';

import { AlertController, Platform } from '@ionic/angular';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonApiService } from '../../services/common-api.service';

import { trigger, keyframes, animate, transition } from '@angular/animations';
import * as kf from '../../utils/keyframes';

@Component({
  selector: 'app-survey-mode',
  templateUrl: './survey-mode.page.html',
  styleUrls: ['./survey-mode.page.scss'],
  animations: [
    trigger('cardAnimator', [
      transition('* => wobble', animate(600, keyframes(kf.wobble))),
      transition('* => swing', animate(1000, keyframes(kf.swing))),
      transition('* => jello', animate(1000, keyframes(kf.jello))),
      transition('* => zoomOutRight', animate(1000, keyframes(kf.zoomOutRight))),
      transition('* => slideOutLeft', animate(1000, keyframes(kf.slideOutLeft))),
      transition('* => rotateOutUpRight', animate(1000, keyframes(kf.rotateOutUpRight))),
      transition('* => flipOutY', animate(1000, keyframes(kf.flipOutY))),
    ])
  ],
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

  // feedback: IFeedback;
  feedback = {} as IFeedback;

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

  constructor(private _route: ActivatedRoute, private _router: Router, private _commonApiService: CommonApiService,
    private _authService: AuthService, private alertController: AlertController,
    private _fb: FormBuilder, private _loadingservice: LoadingService,
    private platform: Platform,
    private _cdr: ChangeDetectorRef) {
      this.selectedoptionArr = [];
  }



  ngOnInit() {

    this.submitForm = this._fb.group({
      guestname: new FormControl(null, Validators.required),
      questionid: new FormControl(null, Validators.required),
      optionid: new FormControl(null, Validators.required),
      surveyid: new FormControl(null, Validators.required),
      otherresponse: new FormControl(null),

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
      console.log('object ionViewDidEnter >> ' + JSON.stringify(array));

      this.surveyid = array[0].surveyid;
      this.surveycode = array[0].surveycode;

      this.result = array.reduce(function (list, el) {
        if (!list[el.question]) {
          list[el.question] = [];
        }
        list[el.question].push(el);
        return list;
      }, {});

      this.keysArr = Object.keys(this.result);
      this.totalquestions = Object.keys(this.result).length;
      console.log('object result >> ' + Object.keys(this.result));
      console.log('object result TET >> ' + JSON.stringify(this.result));

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
    console.log('object >>>> ' + item);
    console.log('object >>>> ' + item.questionid);
    console.log('object >>>> ' + item.res_options);
    console.log('object >>>> ' + item.surveyid);
    console.log('object >>>> ' + item.optionid);

    this.responsemsg = '';

    this.feedback.optionid = item.optionid;
    this.feedback.surveyid = item.surveyid;
    this.feedback.questionid = item.questionid;
    this.feedback.guestname = this.guestname;

    this.currentCompany = item.optionid;

    this.feedback.selectedoptionid = item.optionid;
    this.selectedoptionArr[index] = item.optionid;


    if (item.res_options === 'Other') {
      this.showother = true;
    } else {
      this.showother = false;
    }



    this.submitForm.patchValue({
      optionid: item.optionid,
      surveyid: item.surveyid,
      questionid: item.questionid,
      guestname: this.guestname,

    });




    // this._commonApiService.addResponse(this.feedback).subscribe(data => {
    //   this.apiresponsedata = data;
    //   this._cdr.markForCheck();
    // });

    // this.addIndex = this.addIndex + 1;
    // console.log('object' + this.addIndex);

    // if (this.addIndex > (this.totalquestions - 1)) {
    //   this.endsurvey = true;

    //   this._cdr.markForCheck();
    // }
    // this.animate();

    this.minoneoptionchosen = true;
  }

prev() {
  this.addIndex = this.addIndex - 1;

  if (this.addIndex === 0) {
    this.showprev = false;
  }
  this.minoneoptionchosen = true;
  this.showdone = false;
}

  next(nIndex) {

    if(this.selectedoptionArr[nIndex].length() > 0) {
      console.log('WHAT.. ');
    }

    if (this.minoneoptionchosen === true) {

      this.responsemsg = '';
      this.showother = false;
      this._commonApiService.addResponse(this.submitForm.value).subscribe(data => {
        this.apiresponsedata = data;
        this._cdr.markForCheck();
      });

      this.addIndex = this.addIndex + 1;
      console.log('object' + this.addIndex);
      this.showprev = true;
      this.minoneoptionchosen = false;
      if (this.addIndex === (this.totalquestions - 1)) {
        this.showdone = true;
      //  this.showprev = false;
    //    this.endsurvey = true;
     //   this.submitForm.reset();
        this.showother = false;
     //   this.feedback = {};
    //    this.currentCompany = '';
     //   this.minoneoptionchosen = false;
     //   this.selectedoptionArr = [];
        this._cdr.markForCheck();
      }
      this.animate();
    } else {
      this.responsemsg = 'Please select an option and press Next';
      this._loadingservice.presentToastWithPos(this.responsemsg, 'middle');
      this._cdr.markForCheck();
    }
  }

  done() {
    // debugger;
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
      this._cdr.markForCheck();
    }
    this.animate();
  }

  close() {
    this.presentAlertConfirm();
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Survey not completed. Do you want to <strong>End</strong> now!!! ',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this._router.navigateByUrl(`/sign-in`);
          }
        }
      ]
    });

    await alert.present();
  }


  startAnimation(state) {

    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }

  animate() {
    console.log('object do what ever >>');
    this.startAnimation('swing');
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
    console.log('object >> nwe guest ' + JSON.stringify(array));

    this.surveyid = array[0].surveyid;
    this.surveycode = array[0].surveycode;

    this.result = array.reduce(function (list, el) {
      if (!list[el.question]) {
        list[el.question] = [];
      }
      list[el.question].push(el);
      return list;
    }, {});

   // this.keysArr = Object.keys(this.result);

   this.keysArr =  Reflect.ownKeys(this.result);

    // this.totalquestions = Object.keys(this.result).length;
    this.totalquestions = Reflect.ownKeys(this.result).length;
     console.log('object >> ' +  Reflect.ownKeys(this.result));


    this.guestname = Math.random().toString(36).slice(2);

   this._router.navigateByUrl(`/survey-mode/${this.surveycode}`);
  }



}
