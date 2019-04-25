import { AuthService } from '../../services/auth.service';
import { SurveyService } from './../../services/survey.service';

import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonApiService } from '../../services/common-api.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-compile-survey-questions',
  templateUrl: './compile-survey-questions.page.html',
  styleUrls: ['./compile-survey-questions.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompileSurveyQuestionsPage implements OnInit {
  addquestions = false;

  submitForm: FormGroup;

  survey: ISurvey;
  surveyon = false;
  apiresponsedata: any;
  surveyid: any;
  loggedinUserId: any;

  tempsurvey: any;
  paramsSubscription: Subscription;
  result: any;
  flatMap = [];
  golive = false;

  serviceinfo: any;
  servicetypes: any;

  constructor(private _router: Router, private _cdr: ChangeDetectorRef, private _fb: FormBuilder,
    private _surveyService: SurveyService, private _authservice: AuthService, private _route: ActivatedRoute,
    private _commonApiService: CommonApiService
  ) { }

  ngOnInit() {

    this.submitForm = this._fb.group({
      surveyid: new FormControl(null, Validators.required),
      surveyname: new FormControl(null, Validators.required),
      surveyvenue: new FormControl(null, Validators.required),
      surveydate: new FormControl(null, Validators.required),
      servicetype: new FormControl(null, Validators.required),
      loggedinuser: new FormControl(null, Validators.required)
    });
  }

  ionViewDidEnter() {
    this.flatMap = [];

    this.paramsSubscription = this._route.data.subscribe(data => {
      this.tempsurvey = data['surveydata'];
      this.serviceinfo = data['surveydata'][0];

      this.submitForm.patchValue({
        surveyname: this.serviceinfo.surveyname,
        surveyvenue: this.serviceinfo.surveyvenue,
        surveydate: this.serviceinfo.surveydate,
        surveyid: this.serviceinfo.id

      });


      this._commonApiService.getSurveyInfoById(this.serviceinfo.id).subscribe(qdata => {
        this.tempsurvey = qdata;

        console.log('TRYYYYY >> ' + JSON.stringify(this.tempsurvey));

        if (this.tempsurvey.result === 'NO-QUESTIONS') {

        } else {

          const array = this.tempsurvey;
          this.result = array.reduce(function (list, el) {
            if (!list[el.question]) {
              list[el.question] = [];
            }
            list[el.question].push(el);
            return list;
          }, {});

          console.log('object >> ' + JSON.stringify(this.result));

          Object.values(this.result).forEach(val => {
            if (Array.isArray(val)) {
              const question = val[0].question;
              const qid = val[0].id;
              const surveyid = val[0].surveyid;
              // debugger;
              const reducedArr = val.reduce((acc, item, idx) => {
                if (idx === 0) {
                  return acc + ',' + item.res_options;
                } else {
                  return acc + ' / ' + item.res_options;
                }
              }, val[0].groupname);

              this.flatMap.push({
                questid: qid,
                surveyid: surveyid,
                question: question,

                id: reducedArr.substring(0, reducedArr.indexOf(',')),
                name: reducedArr.substring(
                  reducedArr.indexOf(',') + 1,
                  reducedArr.length
                )
              });
            }
          });
        }
        this._cdr.markForCheck();
      });
      this._cdr.markForCheck();
    });


    this.getAsyncData();
  }

  async getAsyncData() {
    this.loggedinUserId = await (<any>this._authservice.getItems('USER_ID'));

    this.submitForm.patchValue({
      loggedinuser: this.loggedinUserId.toString()
    });

    this._commonApiService.getServiceTypes('tamil', 'food', 'functions')
      .subscribe(
        data => {

          this.servicetypes = data;
          console.log('object TEST' + this.serviceinfo.servicetype);


          this.submitForm.patchValue({
            servicetype: this.serviceinfo.servicetype,
          });
          this._cdr.markForCheck();
        });

    this._cdr.markForCheck();

  }

  addQuestions() {
    this._router.navigateByUrl(`add-questions/${this.serviceinfo.id}`);
  }

  submit() {
    this._commonApiService.updateSurvey(this.submitForm.value).subscribe(data => {
      this.apiresponsedata = data;
      console.log('object<<<<< ' + JSON.stringify(this.apiresponsedata));

      if (this.apiresponsedata.result === 'OK') {
        this._router.navigateByUrl(`/dashboard/${this.loggedinUserId}`);
      }

    });
  }

  dashboard() {
    this._router.navigateByUrl(`/dashboard/${this.loggedinUserId}`);
  }

  goPreview() {

    this._router.navigateByUrl(`/preview/${this.serviceinfo.id}`);
  }

  editquestions(item) {
    console.log('object editquestions >>>> ' + JSON.stringify(item));

    this._router.navigateByUrl(`/edit-questions/${this.serviceinfo.id}/${item.questid}`);
  }

}
