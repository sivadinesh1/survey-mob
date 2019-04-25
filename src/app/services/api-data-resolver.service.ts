
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { CommonApiService } from './common-api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiDataResolverService implements Resolve<any> {

  constructor(private _commonapiservice: CommonApiService, ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const surveyid = route.paramMap.get('surveyid');
    const surveycode = route.paramMap.get('surveycode');
    const survid = route.paramMap.get('survid');
    const userid = route.paramMap.get('userid');
    const previewsurveyid = route.paramMap.get('previewsurveyid');
    const surveyinfo = route.paramMap.get('surveyinfo');
    

    if (surveyid != null) {
      return this._commonapiservice.getSurveyInfoById(route.paramMap.get('surveyid'));
    } else if (surveycode != null) {
      return this._commonapiservice.getSurveyInfoByCode(route.paramMap.get('surveycode'));
    } else if (survid != null) {
      return this._commonapiservice.getSurveyShortSummary(route.paramMap.get('survid'));
    } else if (userid != null) {
      return this._commonapiservice.getUserSurveysByStatus(route.paramMap.get('userid'), 'U');
    } else if (previewsurveyid != null) {
      return this._commonapiservice.getSurveyInfoById(route.paramMap.get('previewsurveyid'));
    } else if (surveyinfo != null) {
      return this._commonapiservice.getSurveyBasicInfoById(route.paramMap.get('surveyinfo'));
    }
  }



}

