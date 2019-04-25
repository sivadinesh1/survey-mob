import { AuthService } from 'src/app/services/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { groupBy } from 'lodash';


@Component({
  selector: 'app-survey-results',
  templateUrl: './survey-results.page.html',
  styleUrls: ['./survey-results.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyResultsPage implements OnInit {
  paramSubscriptions: Subscription;
  surveydata: any;
  surveyinfo: any;

  totalresponsesArr: any;
  totalresponses: any;

  responseArr = [];

  flatMap = [];
  loggedinUserId: any;
  surveyid: any;

  constructor(private _route: ActivatedRoute, private _cdr: ChangeDetectorRef,
    private _router: Router, private _authService: AuthService,
    private _commonApiService: CommonApiService) {
      this.surveyid = this._route.snapshot.params['survid'];
     
      
    }

  ngOnInit() {
    this._route.data.subscribe(data => {
      this.surveydata = data['surveydata'];
    //  console.log('>>>>>>>>>>>>>>>>>>> ' + JSON.stringify(this.surveydata));

      const array = this.surveydata;
   //   this.surveyid = array[0].surveyid;

      this.totalresponsesArr = array.reduce(function (list, el) {
        if (!list[el.guestname]) {
          list[el.guestname] = [];
        }
        list[el.guestname].push(el);
        return list;
      }, {});

      this.totalresponses = Object.entries(this.totalresponsesArr).length;

      let groupedData = groupBy(array, function(d) {return d.questionid; });

      Object.values(groupedData).map(e => {

        console.log('object' + JSON.stringify(e));

        var result1 = Object.values(e).reduce(function (list, el) {
          list[el.res_options] = ++list[el.res_options] || 1;
        
          return list;
        }, {});

console.log('object....' + JSON.stringify(result1));
console.log('object...KEY.' + Object.values(result1));

        let k = e[0].question;
        let j = result1;


 this._commonApiService.getSurveyQuestionResponses(e[0].questionid).subscribe(dat => {
    let tmp = dat;

    Object.keys(tmp).forEach(key=> {
      console.log(tmp[key]);
      let tmpkey = tmp[key].res_options;

      console.log('object@@..' + tmpkey);
      console.log('object##..' + Object.keys(j).indexOf(tmpkey));

      if(Object.keys(j).indexOf(tmpkey) === -1) {
             console.log('object ... not in array ' + tmpkey);
      console.log('object ... nwhat >>>  ' + JSON.stringify(j));

      console.log('is this an array ' + Array.isArray(j));
       // let x = eval(tmpkey);

      j[tmpkey] = 0;
      
      
      }

  //  if(Object.values(j).indexOf(tmpkey) === -1) {
  //     console.log('object ... not in array ' + tmpkey);
  //     console.log('object ... nwhat >>>  ' + JSON.stringify(j));
  //  }


  });


        });


        this.flatMap.push({questions: k, responsesummary: j});
        // debugger;

        // this.flatMap.push( {surveyid: survid, id: reducedArr.substring(0, reducedArr.indexOf(',')),
        // name: reducedArr.substring(reducedArr.indexOf(',') + 1, reducedArr.length)});


        // this._commonApiService.getSurveyQuestionResponses(e.questionid).subscribe(dat => {
        //   console.log('object>>' + JSON.stringify(dat));
        // });

      });

    

    });
    this.getAsyncData();
  }

  async getAsyncData() {

    this.loggedinUserId = await <any>this._authService.getItems('USER_ID');
    this._commonApiService.getSurveyBasicInfoById(this.surveyid).subscribe(sdata => {
      this.surveyinfo = sdata[0];

      this._cdr.markForCheck();
    });
    this._cdr.markForCheck();
    
  }

  goDashboard() {
    this._router.navigateByUrl(`/dashboard/${this.loggedinUserId}`);
  }

  getWidth(item) {
    const v = (item.value / this.totalresponses) * 100;
    return `${v}%`;
  }

   getFilteredCodes(array, key, value) {
    return array.filter(function(e) {
      return e[key] === value;
    });
  }

}
