import { CommonApiService } from './../../services/common-api.service';
import { SurveyService } from './../../services/survey.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.page.html',
  styleUrls: ['./add-questions.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddQuestionsPage implements OnInit {

  survey: any;

  constructor(private _surveyService: SurveyService,
    private _cdr: ChangeDetectorRef,
    private _commonApiSevice: CommonApiService) { }

  ngOnInit() {
    this.getAsyncData();
  }

  async getAsyncData() {
    this._surveyService.surveyconfig.subscribe(res => {
      this.survey = res;
      console.log('values >> ' + JSON.stringify(this.survey));

      this._cdr.markForCheck();
    });



    this._cdr.markForCheck();

  }

}
