import { AlertController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { CommonApiService } from '../../services/common-api.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage implements OnInit {
  loggedinUserId: any;
  items = [
    { id: 1, label: 'நடக்க இருப்பவை', status: 'U', isClicked: true, size: 0 },
    { id: 2, label: 'நடந்து கொண்டு இருப்பவை', status: 'L', isClicked: false, size: 0 },
    { id: 3, label: 'நடந்து முடிந்தவை', status: 'C', isClicked: false, size: 0 }
  ];


  upcomingData: any;
  closeData: any;
  liveData: any;
  draftData: any;
  updateResponse: any;

  upcomingDataLength = 0;
  closeDataLength = 0;
  liveDataLength = 0;
  draftDataLength = 0;

  constructor(private _commonApiService: CommonApiService,
    private alertController: AlertController,
    private _authservice: AuthService,
    private _router: Router, private _cdr: ChangeDetectorRef,
    private _route: ActivatedRoute) {
    this._route.data.subscribe(data => {

      this.upcomingData = data['surveydata'];
      this.upcomingDataLength = this.upcomingData.length;
    });


  }

  ngOnInit() {

  }
  ionViewDidEnter() {
    this.getAsyncData();

  

  }

  async getAsyncData() {
    this.loggedinUserId = await <any>this._authservice.getItems('USER_ID');
    this._commonApiService.getUserSurveysByStatus(this.loggedinUserId, 'U').subscribe(id1 => {
      this.upcomingData = id1;
      this.upcomingDataLength = this.upcomingData.length;
     
      this.items[0].size = this.upcomingDataLength;
      this._cdr.markForCheck();
    });

 
    this._commonApiService.getUserSurveysByStatus(this.loggedinUserId, 'L').subscribe(id2 => {
      this.liveData = id2;
      this.liveDataLength = this.liveData.length;
     
      this.items[1].size = this.liveDataLength;
      this._cdr.markForCheck();
    });
  
    this._commonApiService.getUserSurveysByStatus(this.loggedinUserId, 'C').subscribe(id3 => {
      this.closeData = id3;
      this.closeDataLength = this.closeData.length;
     
      this.items[2].size = this.closeDataLength;
      this._cdr.markForCheck();
    });
  }

  addSurvey() {
    this._router.navigateByUrl('/start-survey');
  }


  toggleClick(clickedItem: any): void {

    for (const item of this.items) {
      item.isClicked = false;
    }

    clickedItem.isClicked = true;

    if (clickedItem.id === 1) {

      this._commonApiService.getUserSurveysByStatus(this.loggedinUserId, clickedItem.status).subscribe(id1 => {
        this.upcomingData = id1;
        this.upcomingDataLength = this.upcomingData.length;
        this.items[0].isClicked = true;
        this._cdr.markForCheck();
      });

    } else if (clickedItem.id === 2) {
      this._commonApiService.getUserSurveysByStatus(this.loggedinUserId, clickedItem.status).subscribe(id2 => {
        this.liveData = id2;
        this.liveDataLength = this.liveData.length;
        this.items[1].isClicked = true;
        this._cdr.markForCheck();
      });
    } else if (clickedItem.id === 3) {
      this._commonApiService.getUserSurveysByStatus(this.loggedinUserId, clickedItem.status).subscribe(id3 => {
        this.closeData = id3;
        this.closeDataLength = this.closeData.length;
        this.items[2].isClicked = true;
        this._cdr.markForCheck();
      });
    }



  }

  goPreview(item: any) {
    console.log('object KAKAK' + JSON.stringify(item));
    this._router.navigateByUrl(`/preview/${item.id}`);
  }

  edit(item: any) {
    this._router.navigateByUrl(`/compile-survey-questions/${item.id}`);
  }


  stopSurvey(item) {
 
    this.presentAlertConfirm(item.id);
  }
  async presentAlertConfirm(surveyid) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Your Survey will <strong>Stop</strong>  now!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this._commonApiService.updateSurveyStatus(surveyid, 'C').subscribe(res => {
              this.updateResponse = res;
              
              if(this.updateResponse.result === 'OK') {
              //  this._router.navigateByUrl(`/dashboard/${this.loggedinUserId}`);
              this._commonApiService.getUserSurveysByStatus(this.loggedinUserId, 'C').subscribe(id3 => {
                this.closeData = id3;
                this.closeDataLength = this.closeData.length;
                this.items[0].isClicked = false;
                this.items[1].isClicked = false;
                this.items[2].isClicked = true;

                this.items[2].size = this.closeDataLength;
                this.items[1].size = this.liveDataLength - 1;

                this._cdr.markForCheck();
              });
              this._cdr.markForCheck();
            }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  results(item: any) {
    console.log('object ' + JSON.stringify(item));
    this._router.navigateByUrl(`survey-results/${item.id}`);
  }


  goLive(item) {
    this.presentGoLiveAlertConfirm(item.id);
  }
  async presentGoLiveAlertConfirm(id) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Your Survey will <strong>Go Live</strong>  now!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this._commonApiService.updateSurveyStatus(id, 'L').subscribe(res => {
              this.updateResponse = res;
              if(this.updateResponse.result === 'OK') {
                this._commonApiService.getUserSurveysByStatus(this.loggedinUserId, 'L').subscribe(id4 => {
               this.liveData = id4;
               this.liveDataLength = this.liveData.length;
               this.items[0].isClicked = false;
               this.items[1].isClicked = true;
               this.items[2].isClicked = false;

               this.items[1].size = this.liveDataLength;
               this.items[0].size = this.upcomingDataLength - 1;

               this._cdr.markForCheck();
                });
              }
              this._cdr.markForCheck();
            });
          }
        }
      ]
    });

    await alert.present();
  }

}
