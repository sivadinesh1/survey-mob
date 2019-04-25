import { AuthService } from '../../services/auth.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonApiService } from '../../services/common-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
})
export class PreviewPage implements OnInit {
  paramsSubscription: Subscription;
  previewsurvey: any;
  loggedinUserId: any;
  tempsurvey: any;
  result: any;
  flatMap = [];
  surveydata: any;
  updateResponse: any;

  message: any;
  surveyid: any;

  tempdata: any;

  constructor(private _router: Router, private _commonApiService: CommonApiService,
    private _route: ActivatedRoute, private alertController: AlertController,
    private _cdr: ChangeDetectorRef, private _authService: AuthService) {

  }

  ngOnInit() {
    this.flatMap = [];
    this.getAsyncData();

    this.paramsSubscription = this._route.data.subscribe(data => {
      console.log('object ' + JSON.stringify(data));
      this.tempdata = data['surveydata'];
      console.log('temp object ' + this.tempdata);
      if (this.tempdata.result === 'NO-QUESTIONS') {
        this.surveyid = this.tempdata.surveyid;
        this.message = 'No Questions Yet';
      } else {
        this.previewsurvey = data['surveydata'][0];
        this.surveyid = this.previewsurvey.surveyid;
        this._commonApiService.getSurveyInfoById(this.previewsurvey.surveyid).subscribe(qdata => {
        this.tempsurvey = qdata;

        console.log('TRYYYYY >> ' + JSON.stringify(this.tempsurvey));

        const array = this.tempsurvey.reverse();
        this.result = array.reduce(function (list, el) {
          if (!list[el.question]) {
            list[el.question] = [];
          }
          list[el.question].push(el);
          return list;
        }, {});

        console.log('object >> ' + JSON.stringify(this.result));

        Object.keys(this.result).forEach(e => {
          console.log('object...' + e);
        });


        this._cdr.markForCheck();
      });
      console.log('inside undefined');
    }

  });


  }

  async getAsyncData() {
    this.loggedinUserId = await <any>this._authService.getItems('USER_ID');
    
    this._commonApiService.getSurveyBasicInfoById(this.surveyid).subscribe(sdata => {
      this.surveydata = sdata[0];

      this._cdr.markForCheck();
    });
  

  }

  goDashboard() {
    this._router.navigateByUrl(`/dashboard/${this.loggedinUserId}`);
  }

  // <div *ngFor="let item of result | keyvalue:descOrder">
  // descOrder = (a, b) => {
  //   if (a.key < b.key) { return b.key; }
  // }

  onSubmit() {
  
  }

  edit() {
    this._router.navigateByUrl(`/compile-survey-questions/${this.previewsurvey.surveyid}`);
  }


}

