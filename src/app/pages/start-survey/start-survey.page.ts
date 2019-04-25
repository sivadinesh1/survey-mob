import { AuthService } from '../../services/auth.service';
import { SurveyService } from './../../services/survey.service';


import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonApiService } from '../../services/common-api.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';


@Component({
  selector: 'app-start-survey',
  templateUrl: './start-survey.page.html',
  styleUrls: ['./start-survey.page.scss'],
})
export class StartSurveyPage implements OnInit {
  addquestions = false;

  submitForm: FormGroup;

  
  survey: ISurvey;
  surveyon = false;
  apiresponsedata: any;
  surveyid: any;
  loggedinUserId: any;
  servicetypes: any;
  validateAllFormFields = SharedService.validateAllFormFields;
  isFieldInvalidTouched = SharedService.isFieldInvalidTouched;
  responsemsg: any;

  constructor(private _router: Router, private _cdr: ChangeDetectorRef,
    private _fb: FormBuilder, private _surveyService: SurveyService,
    private _authservice: AuthService,
    private _commonApiService: CommonApiService) { }

  ngOnInit() {
    this.submitForm = this._fb.group({
      surveyname: new FormControl(null, Validators.required),
      
      surveyvenue: new FormControl(null, Validators.required),
      surveydate: new FormControl(null, Validators.required),
      servicetype: new FormControl(null, Validators.required),
      loggedinuser: new FormControl(null, Validators.required),
    });

    this.getAsyncData();
  }


  async getAsyncData() {
    this._surveyService.surveyconfig.subscribe(res => {
      this.survey = res;

      this._cdr.markForCheck();
    });

    
    this.loggedinUserId = await <any>this._authservice.getItems('USER_ID');

    this.submitForm.patchValue({
      loggedinuser: this.loggedinUserId.toString(),
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

 

    this._router.navigateByUrl(`/add-questions/${this.surveyid}`);
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

        this._cdr.markForCheck();
      }

      });
  }
}

goDashboard() {
  this._router.navigateByUrl(`/dashboard/${this.loggedinUserId}`);
}
 
}
