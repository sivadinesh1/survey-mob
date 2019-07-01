import { AuthService } from './auth.service';

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { CommonApiService } from './common-api.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ApiDataResolverService implements Resolve<any> {

  loggedinUserId: any;
  url: any;

  
  yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
  todayDate = moment().format('YYYY-MM-DD');

  constructor(private _commonapiservice: CommonApiService, 
    private _authservice: AuthService, private router: Router) { 
   
    
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const companyid = route.paramMap.get('companyid');
    const surveyid = route.paramMap.get('surveyid');
    const surveycode = route.paramMap.get('surveycode');
    const survid = route.paramMap.get('survid');
    const userid = route.paramMap.get('userid');
    const previewsurveyid = route.paramMap.get('previewsurveyid');
    const surveyinfo = route.paramMap.get('surveyinfo');
    const companylistinfo = route.paramMap.get('companylistinfo');
    const edit_companyid = route.paramMap.get('edit-companyid');
    const runningsurveyid = route.paramMap.get('runningsurveyid');
  
    if (surveyid != null) {
      return this._commonapiservice.getSurveyInfoById(route.paramMap.get('surveyid'));
    } else if (surveycode != null) {
      return this._commonapiservice.getSurveyInfoByCode(route.paramMap.get('surveycode'));
    } else if (survid != null) {
      return this._commonapiservice.getSurveyShortSummary(route.paramMap.get('survid'), this.todayDate);
    } else if (runningsurveyid != null) {
      return this._commonapiservice.getSurveyBasicInfoById(route.paramMap.get('runningsurveyid'));
      // return this._commonapiservice.getSurveyShortSummary(route.paramMap.get('runningsurveyid'), this.yesterdayDate);
    } else if (userid != null) {
      return this._commonapiservice.getUserSurveysByStatus(route.paramMap.get('userid'), 'U');
    } else if (previewsurveyid != null) {
      return this._commonapiservice.getSurveyInfoById(route.paramMap.get('previewsurveyid'));
    } else if (surveyinfo != null) {
      return this._commonapiservice.getSurveyBasicInfoById(route.paramMap.get('surveyinfo'));
    } else if (companyid != null) {
      return this._commonapiservice.getDashboardUserSurvey(route.paramMap.get('companyid'), 'U');
    } else if (companylistinfo != null) {
      return this._commonapiservice.getCompaniesList(route.paramMap.get('companylistinfo'));
    } else if (edit_companyid != null) {

      console.log('object >>> ' + edit_companyid);
      return this._commonapiservice.getCompanyDetail(edit_companyid);
    }
  }



}

