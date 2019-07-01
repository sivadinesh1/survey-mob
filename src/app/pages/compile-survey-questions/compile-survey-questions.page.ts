import { AllIndustriesComponent } from './../../all-industries/all-industries.component';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { SurveyService } from './../../services/survey.service';

import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonApiService } from '../../services/common-api.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';

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
  companyId: any;
  selectedIndustryData: any;

  languages = ['English', 'Tamil'];
  industrieslist = ['Automobiles', 'Catering'];

  constructor(private _router: Router, private _cdr: ChangeDetectorRef, private _fb: FormBuilder,
    private _surveyService: SurveyService, private _authservice: AuthService, private _route: ActivatedRoute,
    private storage: Storage, private _modalcontroller: ModalController,
    private _commonApiService: CommonApiService
  ) { }

  ngOnInit() {

    this.submitForm = this._fb.group({
      surveyid: new FormControl(null, Validators.required),
      surveyname: new FormControl(null, Validators.required),
      surveyvenue: new FormControl(null, Validators.required),
      surveydate: new FormControl(null, Validators.required),
      servicetype: new FormControl(null, Validators.required),
      language: new FormControl('English', Validators.required),
      industry: new FormControl(null, Validators.required),
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
        surveyid: this.serviceinfo.id,
        language: this.serviceinfo.survey_language,
        industry: this.serviceinfo.survey_industry,

      });

      this._cdr.markForCheck();
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
    this.companyId = await <any>this._authservice.getItems('COMPANY_ID');

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
    
    this._router.navigateByUrl(`add-questions/${this.serviceinfo.id}/${this.flatMap.length}`);
  }

  submit() {
    this._commonApiService.updateSurvey(this.submitForm.value).subscribe(data => {
      this.apiresponsedata = data;
      console.log('object<<<<< ' + JSON.stringify(this.apiresponsedata));

      if (this.apiresponsedata.result === 'OK') {
        this._router.navigateByUrl(`/dashboard/${this.companyId}`);
      }

    });
  }

  dashboard() {
    this._router.navigateByUrl(`/dashboard/${this.companyId}`);
  }

  goPreview() {

    this._router.navigateByUrl(`/preview/${this.serviceinfo.id}`);
  }

  editquestions(item) {
    console.log('object editquestions >>>> ' + JSON.stringify(item));

    this._router.navigateByUrl(`/edit-questions/${this.serviceinfo.id}/${item.questid}`);
  }


async chooseIndustry() {



  const modal = await this._modalcontroller.create({
    component: AllIndustriesComponent,
    componentProps: {
      data: this.industrieslist
    }
  });

  modal.onDidDismiss().then((result) => {
    console.log('The result:', result);
    console.log('The json result:', JSON.stringify(result));

    this.selectedIndustryData = result.data.item;

    this.submitForm.patchValue({
      industry: this.selectedIndustryData,
    });

     this.storage.set('INDUSTRY', this.selectedIndustryData);
     

  
    this._cdr.markForCheck();
    

});

  return await modal.present();
}

selectLanguage() {


  this.storage.set('LANGUAGE', this.submitForm.value.language);
  this._cdr.markForCheck();
}

}
