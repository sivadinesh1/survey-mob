import { ApiSurveyResults } from './../../../services/api-survey-results.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsPage implements OnInit {
  surveyid: any;
  surveyResults: any;

  view = 'daily';

  constructor(private _route: ActivatedRoute, private _cdr: ChangeDetectorRef,
    private _router: Router, private _authService: AuthService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe, @Inject(LOCALE_ID) private locale: string,
    private apiSurveyResults: ApiSurveyResults) {
    this.surveyid = this._route.snapshot.params['surveyid'];
    console.log('TEST' + this.surveyid );
  }

  ngOnInit() {
    this.getAsyncData();
  }

  async getAsyncData() {
    this.surveyResults = await this.apiSurveyResults.getSurveyResultsDashboard(this.surveyid).toPromise();
    console.log(this.surveyResults);
  }

  viewClick(action: string) {

    this.view = action;

  }

  getDetailView(item) {
    const chosedate = formatDate(item.date, 'yyyy-MM-dd', this.locale);
    this._router.navigateByUrl(`daily-reports/${this.surveyid}/${chosedate}`);
  }

}
