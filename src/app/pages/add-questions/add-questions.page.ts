import { SharedService } from './../../services/shared.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { CommonApiService } from './../../services/common-api.service';
import { SurveyService } from './../../services/survey.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.page.html',
  styleUrls: ['./add-questions.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddQuestionsPage implements OnInit {

  survey: any;
  surveyid: any;
  apiresponse: any;

  surveydata: any;

  respArray: any;
  result: any;
  responsemsg: any;
  loggedinUserId: any;
  apiresponsedata: any;
  newquestionid: any;

  currentcount: any;
  maxadditionalchoices = 3;
  defaultresponses = 2;
  morechoiceflag = true;

  submitForm: FormGroup;
  validateAllFormFields = SharedService.validateAllFormFields;
  isFieldInvalidTouched = SharedService.isFieldInvalidTouched;

  flatMap = [];

  language: any;
  industry: any;

  constructor(private _surveyService: SurveyService, private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef, private _fb: FormBuilder,
    private _router: Router,
    private _authservice: AuthService,
    private _commonApiSevice: CommonApiService) { }

  ngOnInit() {


    console.log('object surveyid ' + this.surveyid);

    this.submitForm = this._fb.group({
      surveyid: new FormControl(this.surveyid, [Validators.required]),
      question: new FormControl(null, [Validators.required]),
      optiongroupname: new FormControl(0, null),
      question_sequence: new FormControl('1', [Validators.required]),
      loggedinuser: new FormControl(null, [Validators.required]),
      lang: new FormControl(null, [Validators.required]),
      industry: new FormControl(null, [Validators.required]),
      options: this._fb.array([
        new FormGroup({
          option: new FormControl(null, Validators.required),
        

        })
      ])
    });


    while (--this.defaultresponses) {
     
      this.addResponseOptions();
    
    }


  }

  ionViewDidEnter() {
    this.surveyid = this._route.snapshot.params['surveyid'];

    this.getAsyncData();


  }

  get options(): FormGroup {
    return this.submitForm.get('options') as FormGroup;
}

  async getAsyncData() {
    this.flatMap = [];

    this.submitForm.patchValue({
      surveyid: this.surveyid,
      question: '',
      optiongroupname: '',
      question_sequence: '1',

    });

    this.loggedinUserId = await <any>this._authservice.getItems('USER_ID');
    this.language = await <any>this._authservice.getItems('LANGUAGE');
    this.industry = await <any>this._authservice.getItems('INDUSTRY');

    this.submitForm.patchValue({
      loggedinuser: this.loggedinUserId.toString(),
      lang: this.language,
      industry: this.industry,
    });


      this._commonApiSevice.getSurveyBasicInfoById(this.surveyid).subscribe(sdata => {
        this.surveydata = sdata[0];
      
        this._cdr.markForCheck();
      });

    // let test;
    this._surveyService.surveyconfig.subscribe(res => {
      this.survey = res;
      console.log('values in ADD QUES>> ' + JSON.stringify(this.survey));

      this._cdr.markForCheck();
    });

    this._commonApiSevice.getResponseOptions('tamil', 'food').subscribe(data => {
      this.apiresponse = data;
      const array = this.apiresponse;
      console.log('object >> ' + JSON.stringify(array));

      this.result = array.reduce(function (list, el) {
        if (!list[el.groupname]) {
          list[el.groupname] = [];
        }
        list[el.groupname].push(el);
        return list;
      }, {});


      Object.values(this.result).forEach(val => {
        if (Array.isArray(val)) {
          const reducedArr = val.reduce((acc, item, idx) => {
            if (idx === 0) {
              return acc + ',' + item.res_options;
            } else {
              return acc + ' / ' + item.res_options;
            }

          }, val[0].groupname);


          this.flatMap.push({
            id: reducedArr.substring(0, reducedArr.indexOf(',')),
            name: reducedArr.substring(reducedArr.indexOf(',') + 1, reducedArr.length)
          });

        }

      });

      this._cdr.markForCheck();
      //    console.log('object >> ' + JSON.stringify(this.result));

    });


  }



  onSubmit() {



    if (!this.submitForm.valid) {
      this.validateAllFormFields(this.submitForm);
      this._cdr.markForCheck();
      this.responsemsg = 'Wrong or Missing information. Please check the form.';
    } else {



      this._commonApiSevice.addQuestions(this.submitForm.value).subscribe(data => {

        this.apiresponsedata = data;
        //   this.survey.questions.push({'description': this.submitForm.value.question, 'options': this.submitForm.value.optiongroupname});
        console.log('object<<<<< ' + JSON.stringify(this.apiresponsedata));

        if (this.apiresponsedata.result === 'OK') {
          this.newquestionid = this.apiresponsedata.newquestionid;
          this.submitForm.reset();
          this._router.navigateByUrl(`/compile-survey-questions/${this.surveyid}`);
        }

      });
    }


  }



  onClick(obj) {
    this.submitForm.patchValue({
      optiongroupname: obj.id
    });
    this._cdr.markForCheck();
    console.log('object >>>> ' + obj.id);
  }

  edit() {
    this._router.navigateByUrl(`/compile-survey-questions/${this.surveyid}`);

  }



  onRemoveOptions(i) {
    (<FormArray>this.submitForm.get('options')).removeAt(i);

    console.log('current max add choice values ' + this.maxadditionalchoices);

    this.maxadditionalchoices++;

    this.morechoiceflag = true;
    console.log('current max add AFTE choice values ' + this.maxadditionalchoices);
    this._cdr.markForCheck();

  }

  addResponseOptions() {

   // this.currentcount = this.currentcount++;

        const control =    new FormGroup({
          option: new FormControl(null, Validators.required),
        
        });

        (<FormArray>this.submitForm.get('options')).push(control);
        this._cdr.markForCheck();
      }


      addResponses() {

      
        

        if (this.maxadditionalchoices !== 0) {
          this.addResponseOptions();
        }
        
        this.maxadditionalchoices--;
        if (this.maxadditionalchoices === 0) {
          console.log('no more choices');
          this.morechoiceflag = false;

        }
       
        
        this._cdr.markForCheck();
        }
      
     

}

