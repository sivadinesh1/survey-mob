import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService {

  restApiUrl = environment.restApiUrl;
  constructor(private _httpclient: HttpClient) { }

  verifyOTP(otpsessionid: any, enteredotp: any) {
    return this._httpclient.post(`${this.restApiUrl}/api/verifyotp/${otpsessionid}/${enteredotp}`,  {observe: 'response'});
  }

  sendOTP(mobilenumber: any) {
    return this._httpclient.post(`${this.restApiUrl}/api/sendotp/${mobilenumber}`,  {observe: 'response'});
}

addUser(submitForm: any) {
  return this._httpclient.post(`${this.restApiUrl}/api/add-user`, submitForm);
}

addSurvey(submitForm: any) {
  return this._httpclient.post(`${this.restApiUrl}/api/add-survey`, submitForm);
}

addQuestions(submitForm: any) {
  return this._httpclient.post(`${this.restApiUrl}/api/add-survey-question`, submitForm);
}

getResponseOptions(lang: any, industry: any) {
  return this._httpclient.get(`${this.restApiUrl}/api/response-options/${lang}/${industry}`);
}


getSurveyInfoById(surveyid: any) {
  return this._httpclient.get(`${this.restApiUrl}/api/survey-info-by-id/${surveyid}`);
}

getSurveyBasicInfoById(surveyid: any) {
  return this._httpclient.get(`${this.restApiUrl}/api/survey-basic-info/${surveyid}`);
}

getUserInfo(surveyid: any) {
  return this._httpclient.get(`${this.restApiUrl}/api/get-user-info/${surveyid}`);
}

getSurveyInfoByCode(surveycode: any, ) {
  return this._httpclient.get(`${this.restApiUrl}/api/survey-info-by-code/${surveycode}`);
}

getServiceTypes(lang: any, industry: any, servicecategory: any) {
  return this._httpclient.get(`${this.restApiUrl}/api/service-type/${lang}/${industry}/${servicecategory}`);
}



checkValidSurveyCode(surveycode: any, ) {
  return this._httpclient.get(`${this.restApiUrl}/api/check-valid-surveycode/${surveycode}`);
}

addResponse(submitForm: any) {
  return this._httpclient.post(`${this.restApiUrl}/api/add-response`, submitForm);
}


getSurveyShortSummary(surveyid: any) {
  return this._httpclient.get(`${this.restApiUrl}/api/survey-short-summary/${surveyid}`);
}



getUserSurveysByStatus(userid: any, status: any) {
  return this._httpclient.get(`${this.restApiUrl}/api/user-surveys-status/${userid}/${status}`);
}

getSurveyQuestionResponses(surveyquestionid: any) {
  return this._httpclient.get(`${this.restApiUrl}/api/get-survey-question-responses/${surveyquestionid}`);
}

signIn(submitForm: any) {
  return this._httpclient.post(`${this.restApiUrl}/api/signin`, submitForm);
}


updateSurveyStatus(surveyid: any, status: any) {
  return this._httpclient.get(`${this.restApiUrl}/api/update-survey-status/${surveyid}/${status}`);
}

getSurveyQuestion(surveyid: any, surveyquestionid: any) {
  return this._httpclient.get(`${this.restApiUrl}/api/get-survey-question/${surveyid}/${surveyquestionid}`);
}


deleteQuestion(surveyid: any, surveyquestionid: any) {
  return this._httpclient.get(`${this.restApiUrl}/api/delete-question/${surveyid}/${surveyquestionid}`);
}


updateQuestion(submitForm: any) {
  return this._httpclient.post(`${this.restApiUrl}/api/update-question`, submitForm);
}

updateSurvey(submitForm: any) {
  return this._httpclient.post(`${this.restApiUrl}/api/update-survey`, submitForm);
}

}


