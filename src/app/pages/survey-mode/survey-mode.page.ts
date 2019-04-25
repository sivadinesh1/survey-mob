

import { AuthService } from '../../services/auth.service';

import { AlertController } from '@ionic/angular';

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
      transition('* => wobble', animate(1000, keyframes(kf.wobble))),
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

  constructor(private _route: ActivatedRoute, private _router: Router, private _commonApiService: CommonApiService,
    private _authService: AuthService, private alertController: AlertController,
    private _cdr: ChangeDetectorRef) {

  }

  ngOnInit() {

  }

  ionViewDidEnter() {

    this.qnprogress = 0;
    this.result = [];
    this.totalquestions = 0;
    this.addIndex = 0;

    this.paramsSubscription = this._route.data.subscribe(data => {
      this.surveydata = data['surveydata'];

      const array = this.surveydata;
      console.log('object >> ' + JSON.stringify(array));

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
      console.log('object >> ' + Object.keys(this.result));


    });
    this.guestname = Math.random().toString(36).slice(2);
    this.getAsyncData();
  }

  async getAsyncData() {
    this.loggedinUserId = await <any>this._authService.getItems('USER_ID');

    this._commonApiService.getUserInfo(this.surveyid).subscribe(sdata => {
      this.userinfo = sdata[0];

      this._cdr.markForCheck();
    });


  }


  onClick(item) {
    console.log('object >>>> ' + item);
    console.log('object >>>> ' + item.questionid);
    console.log('object >>>> ' + item.res_options);
    console.log('object >>>> ' + item.surveyid);
    console.log('object >>>> ' + item.optionid);

    this.feedback.optionid = item.optionid;
    this.feedback.surveyid = item.surveyid;
    this.feedback.questionid = item.questionid;
    this.feedback.guestname = this.guestname;

    //  console.log('object >>>> make' + this.result[this.keysArr[addIndex]]);

    this._commonApiService.addResponse(this.feedback).subscribe(data => {
      this.apiresponsedata = data;
      this._cdr.markForCheck();
    });

    this.addIndex = this.addIndex + 1;
    console.log('object' + this.addIndex);

    if (this.addIndex > (this.totalquestions - 1)) {
      this.endsurvey = true;

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
    console.log(state)
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }

  animate() {
    console.log('object do what ever >>');
    this.startAnimation('flipOutY');
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
    window.location.reload();
   this._router.navigateByUrl(`/survey-mode/${this.surveycode}`);
  }

}
