import { ShareComponent } from './../../components/share/share.component';


import { AuthService } from 'src/app/services/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { groupBy } from 'lodash';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';
import { ModalController } from '@ionic/angular';
import { socketApiUrl } from '../../../environments/environment';
import * as socketIo from 'socket.io-client';
import * as moment from 'moment';

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

   rescount: any;

  text = 'Check out Survey Results!';
  shareurl = 'https://squapl.com';

  
  //yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
  todayDate = moment().format('YYYY-MM-DD');

  constructor(private _route: ActivatedRoute, private _cdr: ChangeDetectorRef,
    private _router: Router, private _authService: AuthService,
    private socialSharing: SocialSharing,
    private file: File, private _modalcontroller: ModalController,
    private _commonApiService: CommonApiService) {
    this.surveyid = this._route.snapshot.params['survid'];

  }

  ngOnInit() {




    this._route.data.subscribe(data => {
      this.surveydata = data['surveydata'];
      const array = this.surveydata;

      this._commonApiService.getSurveyResponsesCount(this.surveyid, this.todayDate).subscribe(resdat => {
         this.rescount = resdat[0];
         
        this.totalresponses = this.rescount.count;
        this._cdr.markForCheck();
      });

// debugger;
      let groupedData = groupBy(array, function (d) { return d.questionid; });

      Object.values(groupedData).map(e => {

        var result1 = Object.values(e).reduce(function (list, el) {
          list[el.res_options] = ++list[el.res_options] || 1;

          return list;
        }, {});

        let k = e[0].question;
        let j = result1;

        // debugger;

        this._commonApiService.getSurveyQuestionResponses(e[0].questionid).subscribe(dat => {
          let tmp = dat;

          Object.keys(tmp).forEach(key => {
       
            let tmpkey = tmp[key].res_options;
            let temokeyid = tmp[key].id;
       
            if (Object.keys(j).indexOf(tmpkey) === -1) {

              j[tmpkey] = [0, temokeyid];
          //  }
            } else {
              j[tmpkey] = [Object.values(j)[0], temokeyid];
            }

          });

        });

        console.log('ff' + JSON.stringify(j));
        this.flatMap.push({ questions: k, responsesummary: j });


      });



    });
    this.getAsyncData();


   // const socket = socketIo('http://localhost:4444/');
    const socket = socketIo(`${this.socketApiUrl}`);
    socket.on('hello', (data) => {

       this.surveydata = data;
       const array = this.surveydata;

       if(Array.isArray(array)) {
        this.flatMap = [];

        this._commonApiService.getSurveyResponsesCount(this.surveyid, this.todayDate).subscribe(resdat => {
          this.rescount = resdat;
        this.totalresponses = this.rescount.count;
      });

// debugger;
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

console.log('Final >> ' + JSON.stringify(this.flatMap));
      });


       }

    


      this._cdr.markForCheck();

    });

  }
  ngOnDestroy() {

  }

 

  async shareWhatsApp() {
    // Text + Image or URL works
    this.socialSharing.shareViaWhatsApp(this.text, null, this.shareurl).then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }
 
  async resolveLocalFile() {
    return this.file.copyFile(`${this.file.applicationDirectory}www/assets/imgs/`, 'academy.jpg', this.file.cacheDirectory, `${new Date().getTime()}.jpg`);
  }
 
  removeTempFile(name) {
    this.file.removeFile(this.file.cacheDirectory, name);
  }
 
  async shareEmail() {
    let file = await this.resolveLocalFile();
 
    this.socialSharing.shareViaEmail(this.text, 'My custom subject', ['sivadinesh@gmail.com'], null, null, file.nativeURL).then(() => {
      this.removeTempFile(file.name);
    }).catch((e) => {
      // Error!
    });
  }
 
  async shareFacebook() {
    let file = await this.resolveLocalFile();
 
    // Image or URL works
    this.socialSharing.shareViaFacebook(null, file.nativeURL, null).then(() => {
      this.removeTempFile(file.name);
    }).catch((e) => {
      // Error!
    });
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
  
    const v = (item.value[0] / this.totalresponses) * 100;
    return `${v}%`;
  }

  getFilteredCodes(array, key, value) {
    return array.filter(function (e) {
      return e[key] === value;
    });
  }



  async share() {

    const modal = await this._modalcontroller.create({
      component: ShareComponent,
      componentProps: {
        data: this.shareurl
      }
    });
 
    modal.onDidDismiss().then((result) => {
   
  });
  
    return await modal.present();

  }



}
