import { AuthService } from './../../services/auth.service';
import { SharedService } from '../../services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonApiService } from '../../services/common-api.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-questions',
  templateUrl: './edit-questions.page.html',
  styleUrls: ['./edit-questions.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditQuestionsPage implements OnInit {
  surveyquestionid: any;
  surveyid: any;
  questionData: any;

  loggedinUserId: any;
  apiresponsedata: any;
  newquestionid: any;
  apiresponse: any;
  username: any;

  flatMap = [];

  submitForm: FormGroup;
  responsemsg: any;
  result: any;
  delresponse: any;
  validateAllFormFields = SharedService.validateAllFormFields;

  constructor(private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService,
    private _route: ActivatedRoute, private _fb: FormBuilder, private _authService: AuthService,
    private _router: Router, ) {
    this.surveyid = this._route.snapshot.params['surveyid'];
    this.surveyquestionid = this._route.snapshot.params['surveyquestionid'];
  }

  ngOnInit() {
    this.submitForm = this._fb.group({
      surveyid: new FormControl(this.surveyid, [Validators.required]),
      question: new FormControl(null, [Validators.required]),
      optiongroupname: new FormControl(null, [Validators.required]),
      question_sequence: new FormControl('1', [Validators.required]),
      loggedinuser: new FormControl(null, [Validators.required]),
      surveyquestionid: new FormControl(this.surveyquestionid, [Validators.required]),
    });

    this._commonApiService.getSurveyQuestion(this.surveyid, this.surveyquestionid).subscribe(data => {
      this.questionData = data[0];
      this.submitForm.patchValue({
        question: this.questionData.question,
        optiongroupname: this.questionData.optiongroupname,
      });
      this._cdr.markForCheck();

    });


    this._commonApiService.getResponseOptions('tamil', 'food').subscribe(data => {
      this.apiresponse = data;
      const array = this.apiresponse;

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


    });
    this.getAsyncData();
  }

  async getAsyncData() {

    this.loggedinUserId = await <any>this._authService.getItems('USER_ID');
    this.username = await <any>this._authService.getItems('USER_NAME');

    this.submitForm.patchValue({
      loggedinuser: this.loggedinUserId,
    });
    this._cdr.markForCheck();
  }

  onClick(obj) {
    this.submitForm.patchValue({
      optiongroupname: obj.id
    });
    this._cdr.markForCheck();
    console.log('object >>>> ' + obj.id);
  }

  onSubmit() {
    if (!this.submitForm.valid) {
      this.validateAllFormFields(this.submitForm);

      this._cdr.markForCheck();
      this.responsemsg = 'Wrong or Missing information. Please check the form.';
    } else {



      this._commonApiService.updateQuestion(this.submitForm.value).subscribe(data => {

        this.apiresponsedata = data;
        //   this.survey.questions.push({'description': this.submitForm.value.question, 'options': this.submitForm.value.optiongroupname});
        console.log('object<<<<< ' + JSON.stringify(this.apiresponsedata));

        if (this.apiresponsedata.result === 'OK') {
          this.newquestionid = this.apiresponsedata.newquestionid;
          this.submitForm.reset();
          this._router.navigateByUrl(`/compile-survey-questions/${this.surveyid}`);
        }
        this._cdr.markForCheck();
      });
    }


  }

  delete() {
    this._commonApiService.deleteQuestion(this.surveyid, this.surveyquestionid).subscribe(deldata => {
      this.delresponse = deldata;

      if (this.delresponse.result === 'OK') {
        this._router.navigateByUrl(`/compile-survey-questions/${this.surveyid}`);
      } else {

      }
    });


  }

  back() {
    this._router.navigateByUrl(`/compile-survey-questions/${this.surveyid}`);
  }


}
