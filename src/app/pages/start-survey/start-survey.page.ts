import { SurveyService } from './../../services/survey.service';


import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonApiService } from 'src/app/services/common-api.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { allSettled } from 'q';
import { Router } from '@angular/router';


@Component({
  selector: 'app-start-survey',
  templateUrl: './start-survey.page.html',
  styleUrls: ['./start-survey.page.scss'],
})
export class StartSurveyPage implements OnInit {
  addquestions = false;

  submitForm: FormGroup;

  
  survey: ISurvey;

  constructor(private _router: Router, private _cdr: ChangeDetectorRef,
    private _fb: FormBuilder, private _surveyService: SurveyService,
    private _commonApiService: CommonApiService) { }

  ngOnInit() {
    this.submitForm = this._fb.group({
      custname: new FormControl(null, Validators.required),
      venue: new FormControl(null, Validators.required),
      eventdate: new FormControl(null, Validators.required),
      eventtime: new FormControl(null, Validators.required)
    });

    this.getAsyncData();
  }


  async getAsyncData() {
    this._surveyService.surveyconfig.subscribe(res => {
      this.survey = res;

      this._cdr.markForCheck();
    });

    

    this._cdr.markForCheck();

  }


  addQuestions() {

  //   public  survey: ISurvey = {'custname': '', 'venue': '', 'date': '', 'time': '',
  //   questions: [{'description': '', 'options': ''}]
  //  };

    

    const custname = this.submitForm.value.custname;
    const venue = this.submitForm.value.venue;
    const eventdate = this.submitForm.value.eventdate;
    const eventtime = this.submitForm.value.eventtime;

    this.survey.custname = custname;
    this.survey.venue = venue;
    this.survey.eventdate = eventdate;
    this.survey.eventtime = eventtime;
    console.log('object' + JSON.stringify(this.survey));

    this._surveyService.setSurveyConfig(this.survey);
    this._cdr.markForCheck();

    this._router.navigateByUrl('add-questions');
  }
 
}
