import { AllIndustriesComponent } from './../../all-industries/all-industries.component';
import { Platform, ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { SurveyService } from './../../services/survey.service';


import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonApiService } from '../../services/common-api.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-start-survey',
  templateUrl: './start-survey.page.html',
  styleUrls: ['./start-survey.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartSurveyPage implements OnInit {
  addquestions = false;

  submitForm: FormGroup;
  needcontact = false;

  survey: ISurvey;
  surveyon = false;
  apiresponsedata: any;
  surveyid: any;
  loggedinUserId: any;
  servicetypes: any;
  validateAllFormFields = SharedService.validateAllFormFields;
  isFieldInvalidTouched = SharedService.isFieldInvalidTouched;
  responsemsg: any;
  companyId: any;
  companyname: any;

  // languages = ['English', 'Tamil'];
  languages = [{'code': 'en', 'text': 'English'}, {'code': 'tm', 'text': 'Tamil'}];

  industrieslist = ['Automobiles', 'Catering'];


  selectedIndustryData: any;

  date = new Date();

  myDate: any;

  constructor(private _router: Router, private _cdr: ChangeDetectorRef,
    private _fb: FormBuilder, private _surveyService: SurveyService,
    private _authservice: AuthService, private platform: Platform,
    private storage: Storage,
    private _loadingservice: LoadingService, private _modalcontroller: ModalController,
    private _commonApiService: CommonApiService) {


      this.myDate = new Date(this.date.getTime() -
                       this.date.getTimezoneOffset() * 60000).toISOString();


     }


  ngOnInit() {
    this.submitForm = this._fb.group({
      surveyname: new FormControl(null, Validators.required),

      surveyvenue: new FormControl(null, Validators.required),
      surveydate: new FormControl(this.myDate, Validators.required),
      servicetype: new FormControl(null),
      language: new FormControl(null, Validators.required),
      industry: new FormControl(null, Validators.required),
      companyid: new FormControl(null, Validators.required),
      
      needcontactflag: new FormControl('N', Validators.required),
      loggedinuser: new FormControl(null, Validators.required),
    });


    this.getAsyncData();
  }


  async getAsyncData() {

    this._authservice.companyName.subscribe(companydata => {
      this.companyname = companydata;
      console.log('object....' + this.companyname);

      this._cdr.markForCheck();
    });


    this._surveyService.surveyconfig.subscribe(res => {
      this.survey = res;

      this._cdr.markForCheck();
    });


    this.loggedinUserId = await <any>this._authservice.getItems('USER_ID');
    this.companyId = await <any>this._authservice.getItems('COMPANY_ID');
    this.companyname = await <any>this._authservice.getItems('COMPANY_NAME');

    this.submitForm.patchValue({
      loggedinuser: this.loggedinUserId.toString(),
      companyid: this.companyId,
    });



    this._commonApiService.getServiceTypes('tamil', 'food', 'functions')
    .subscribe(
      data => {

        this.servicetypes = data;
        console.log('object' + JSON.stringify(this.servicetypes));
      });

    this._cdr.markForCheck();

  }


  addQuestions() {



    this._router.navigateByUrl(`/add-questions/${this.surveyid}/0`);
  }

  registerSurvey() {



    if (!this.submitForm.valid) {
      this.validateAllFormFields(this.submitForm);
      this.responsemsg = 'Wrong or Missing information. Please check the form.';
    } else {
    this.survey.surveyname =  this.submitForm.value.surveyname;

    this.survey.surveyvenue = this.submitForm.value.surveyvenue;
    this.survey.surveydate = this.submitForm.value.surveydate;
    this.survey.servicetype = this.submitForm.value.servicetype;
    this.survey.survey_lang = this.submitForm.value.language;
    this.survey.survey_industry = this.submitForm.value.industry;
    this.survey.loggedinuser = this.loggedinUserId;

    console.log('object 123' + JSON.stringify(this.survey));

    this._surveyService.setSurveyConfig(this.survey);
    this._cdr.markForCheck();


    this._commonApiService.addSurvey(this.submitForm.value).subscribe(data => {
      this.apiresponsedata = data;
      console.log('object<<<<< ' + JSON.stringify(this.apiresponsedata));

      if (this.apiresponsedata.result === 'OK') {
        this.surveyon = true;
        this.survey.id = this.apiresponsedata.newsurvey;
        this.surveyid = this.apiresponsedata.newsurvey;
        this._loadingservice.presentToastWithOptions('Survey Created Successfully. Add your questions', 'middle', false, '');
        this._cdr.markForCheck();
      }

      });
  }
}

goDashboard() {
  this._router.navigateByUrl(`/dashboard/${this.companyId}`);
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



onClick(event) {
  console.log('object.....' + event.target.checked );

  if(event.target.checked) {
    this.submitForm.patchValue({
      needcontactflag: 'Y',
    });

  } else {
    this.submitForm.patchValue({
     needcontactflag: 'N',
    });

  }

}

}
