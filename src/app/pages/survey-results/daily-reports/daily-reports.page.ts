import { ShareComponent } from './../../../components/share/share.component';
import { AuthService } from 'src/app/services/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { groupBy } from 'lodash';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';
import { ModalController } from '@ionic/angular';
import { socketApiUrl } from '../../../../environments/environment';
import * as moment from 'moment';
import { IonInfiniteScroll } from '@ionic/angular';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-daily-reports',
  templateUrl: './daily-reports.page.html',
  styleUrls: ['./daily-reports.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyReportsPage implements OnInit {
  paramSubscriptions: Subscription;
  surveydata: any;
  surveyinfo: any;

  totalresponsesArr: any;
  totalresponses: any;

  responseArr = [];

  flatMap = [];

  flatMapIScroll = [];

  loggedinUserId: any;
  surveyid: any;
  companyId: any;
  socketApiUrl = socketApiUrl;

  rescount: any;

  tempArry: any;

  chosendate: any;

  text = 'Check out Survey Results!';
  shareurl = 'https://squapl.com';

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  todayDate = moment().format('YYYY-MM-DD');
  previousDate: any;

  constructor(private _route: ActivatedRoute, private _cdr: ChangeDetectorRef,
    private _router: Router, private _authService: AuthService,
    private socialSharing: SocialSharing,
    private datePipe: DatePipe, @Inject(LOCALE_ID) private locale: string,
    private file: File, private _modalcontroller: ModalController,
    private _commonApiService: CommonApiService) {
    this.surveyid = this._route.snapshot.params['runningsurveyid'];
    this.chosendate = this._route.snapshot.params['chosendate'];

   // this.previousDate = this.todayDate;
   this.previousDate = this.chosendate;
  }

   ngOnInit() {
    this._route.data.subscribe(data => {
      this.surveyinfo = data['surveydata'][0];
    });

     this.loadData(null);
    
    this.getAsyncData();
  }


  async shareWhatsApp() {
    // Text + Image or URL works
    this.socialSharing.shareViaWhatsApp(this.text, null, this.shareurl).then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }


  async getAsyncData() {
    this.loggedinUserId = await <any>this._authService.getItems('USER_ID');
    this.companyId = await <any>this._authService.getItems('COMPANY_ID');
    this._cdr.markForCheck();
  }

  goDashboard() {
    this._router.navigateByUrl(`/dashboard/${this.companyId}`);
  }

  getWidth(item, tot) {
    const v = (item.value / tot) * 100;
    return `${v}%`;
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


  loadData(event) {
    setTimeout(async () => {
      console.log('Done');
      if (event !== null) {
        event.target.complete();
      }

      if (event !== null) {
       this.previousDate = moment(this.previousDate).subtract(1, 'days').format('YYYY-MM-DD');
      }

      console.log('DATE >>> ' + this.previousDate);
      const resdat = await this._commonApiService.getSurveyResponsesCount(this.surveyid, this.previousDate).toPromise();
      this.rescount = resdat[0];
      console.log('test >> ' + JSON.stringify(this.rescount));
      this.totalresponses = this.rescount.count;

      if (this.totalresponses === 0 && event !== null) {

        console.log('where r u ');
        this.flatMapIScroll = [];
        this.tempArry = Array.from(this.flatMapIScroll);
        this.responseArr.push({ whatdate: this.previousDate, totres: 0, reslist: this.tempArry });

        this._cdr.markForCheck();

      } else {

        this.flatMapIScroll = [];

        this.surveydata = await this._commonApiService.getSurveyShortSummary(this.surveyid, this.previousDate).toPromise();

        const array = this.surveydata;

        if (this.surveydata === 'undefined') {
          return;
        }


        const groupedData = groupBy(array, function (d) { return d.questionid; });
        // debugger;
        Object.values(groupedData).map(e => {

          const result1 = Object.values(e).reduce(function (list, el) {
            list[el.res_options] = ++list[el.res_options] || 1;

            return list;
          }, {});

          const k = e[0].question;
          const j = result1;


          this._commonApiService.getSurveyQuestionResponses(e[0].questionid).subscribe(dat => {
            const tmp = dat;
// debugger;
            Object.keys(tmp).forEach(key => {
// debugger;
              const tmpkey = tmp[key].res_options;

              if (Object.keys(j).indexOf(tmpkey) === -1) {

                j[tmpkey] = 0;

              }

            });

          });

          this.flatMapIScroll.push({ questionid: e[0].questionid, questions: k, responsesummary: j });
          this.tempArry = Array.from(this.flatMapIScroll);

        });

        this.responseArr.push({ whatdate: this.previousDate, totres: this.totalresponses, reslist: this.tempArry });
        // debugger;
        this.getAsyncData();
      }

      this._cdr.markForCheck();



    }, 500);
  }

  showDetailReport(item, general, questionid) {
    console.log("item " + JSON.stringify(item));
    console.log("general " + JSON.stringify(general));
    console.log("questionid " + JSON.stringify(questionid));

    // this._commonApiService.getSurveyDetailSummary(this.surveyid, general.whatdate, item.).subscribe(dat => {
    // });
  }
  


}
