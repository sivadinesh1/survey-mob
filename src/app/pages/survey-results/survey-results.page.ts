
import { DataService } from './../../services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { groupBy } from 'lodash';

import * as socketIo from 'socket.io-client';
import { socketApiUrl } from '../../../environments/environment';

@Component({
  selector: 'app-survey-results',
  templateUrl: './survey-results.page.html',
  styleUrls: ['./survey-results.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyResultsPage implements OnInit, OnDestroy {
  paramSubscriptions: Subscription;
  surveydata: any;
  surveyinfo: any;

  totalresponsesArr: any;
  totalresponses: any;

  responseArr = [];

  flatMap = [];
  loggedinUserId: any;
  surveyid: any;
  companyId: any;

  socketApiUrl = socketApiUrl;

  constructor(private _route: ActivatedRoute, private _cdr: ChangeDetectorRef,
    private _router: Router, private _authService: AuthService,
    private dataservice: DataService,
    private _commonApiService: CommonApiService) {
    this.surveyid = this._route.snapshot.params['survid'];


  }

  ngOnInit() {




    this._route.data.subscribe(data => {
      this.surveydata = data['surveydata'];
      const array = this.surveydata;

      this.totalresponsesArr = array.reduce(function (list, el) {
        if (!list[el.guestname]) {
          list[el.guestname] = [];
        }
        list[el.guestname].push(el);
        return list;
      }, {});

      this.totalresponses = Object.entries(this.totalresponsesArr).length;

      let groupedData = groupBy(array, function (d) { return d.questionid; });

      Object.values(groupedData).map(e => {

        var result1 = Object.values(e).reduce(function (list, el) {
          list[el.res_options] = ++list[el.res_options] || 1;

          return list;
        }, {});

        let k = e[0].question;
        let j = result1;


        this._commonApiService.getSurveyQuestionResponses(e[0].questionid).subscribe(dat => {
          let tmp = dat;

          Object.keys(tmp).forEach(key => {
       //     console.log(tmp[key]);
            let tmpkey = tmp[key].res_options;

            if (Object.keys(j).indexOf(tmpkey) === -1) {

              j[tmpkey] = 0;

            }

          });

        });


        this.flatMap.push({ questions: k, responsesummary: j });


      });



    });
    this.getAsyncData();


    // const socket = socketIo('http://localhost:4444/');
    const socket = socketIo(`${this.socketApiUrl}`);
    socket.on('hello', (data) => {
    //  console.log(data);


       this.surveydata = data;
       const array = this.surveydata;

    //   console.log('>>>>>>>>> ' + JSON.stringify(array));

     //  console.log("is array " + Array.isArray(array1));

       if(Array.isArray(array)) {
        this.flatMap = [];
        this.totalresponsesArr = array.reduce(function (list, el) {
          if (!list[el.guestname]) {
            list[el.guestname] = [];
          }
          list[el.guestname].push(el);
          return list;
        }, {});


      this.totalresponses = Object.entries(this.totalresponsesArr).length;

      let groupedData = groupBy(array, function (d) { return d.questionid; });

      Object.values(groupedData).map(e => {

        var result1 = Object.values(e).reduce(function (list, el) {
          list[el.res_options] = ++list[el.res_options] || 1;

          return list;
        }, {});

        let k = e[0].question;
        let j = result1;


        this._commonApiService.getSurveyQuestionResponses(e[0].questionid).subscribe(dat => {
          let tmp = dat;

          Object.keys(tmp).forEach(key => {
       //     console.log(tmp[key]);
            let tmpkey = tmp[key].res_options;

            if (Object.keys(j).indexOf(tmpkey) === -1) {

              j[tmpkey] = 0;

            }

          });

        });


        this.flatMap.push({ questions: k, responsesummary: j });


      });


       }

    


      this._cdr.markForCheck();

    });

  }
  ngOnDestroy() {

  }


  async getAsyncData() {

    this.loggedinUserId = await <any>this._authService.getItems('USER_ID');
    this.companyId = await <any>this._authService.getItems('COMPANY_ID');

    this._commonApiService.getSurveyBasicInfoById(this.surveyid).subscribe(sdata => {
      this.surveyinfo = sdata[0];

      this._cdr.markForCheck();
    });
    this._cdr.markForCheck();

  }

  goDashboard() {
    this._router.navigateByUrl(`/dashboard/${this.companyId}`);
  }

  getWidth(item) {
  
    const v = (item.value / this.totalresponses) * 100;
    return `${v}%`;
  }

  getFilteredCodes(array, key, value) {
    return array.filter(function (e) {
      return e[key] === value;
    });
  }

}
