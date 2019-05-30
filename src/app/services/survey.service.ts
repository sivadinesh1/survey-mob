import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})


export class SurveyService {


   public  survey: ISurvey = {'id': '', 'surveyname': '', 'surveycode': '', 'surveyvenue': '', 
   'surveydate': '', 'servicetype': '', 'survey_lang': '',
   'survey_industry': '', 
    'loggedinuser': '',
   questions: []
  };

   public _surveys = new BehaviorSubject<ISurvey>(this.survey);


  constructor(private storage: Storage, private plt: Platform,

    private _httpclient: HttpClient) {

    this.plt.ready().then(() => {
      console.log('when calling 1');
    });
  }

  getItems(key): Promise<string> {
    return this.storage.get(key);
  } 

  get surveyconfig() {
    return this._surveys.asObservable();
  }

  get surveys() {
    console.log('when calling 1@@' + this._surveys);
    return this._surveys.asObservable();
  }

  setSurveyConfig(val: ISurvey) {
    this._surveys.next(val);
  }



}


