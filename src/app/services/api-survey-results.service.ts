import { environment, restApiUrl } from '../../environments/environment';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiSurveyResults {

  restApiUrl = restApiUrl;
  constructor(private _httpclient: HttpClient) { }

  getSurveyResultsDashboard(surveyid: any) {
    return this._httpclient.get(`${this.restApiUrl}/api/results/survey-results-dashboard/${surveyid}`);
  }


getSurveyDetailSummary(surveyid: any, selecteddate: any, questionid: any, optionid: any) {
  return this._httpclient.get(`${this.restApiUrl}/api/results/survey-detail-summary/${surveyid}/${selecteddate}/${questionid}/${optionid}`);
}


}


