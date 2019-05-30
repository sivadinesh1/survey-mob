import { LoadingService } from 'src/app/services/loading.service';
import { AllCompaniesComponent } from './../../components/all-companies/all-companies.component';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { CommonApiService } from '../../services/common-api.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

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

  companieslist: any;

  upcomingDataLength = 0;
  closeDataLength = 0;
  liveDataLength = 0;
  draftDataLength = 0;
  companyId: any;
  selectedCompanyData: any;

  activecompany: any;


  companyselected: any;

  constructor(private _commonApiService: CommonApiService,
    private alertController: AlertController,
    private _authservice: AuthService,
    private _modalcontroller: ModalController,
    private storage: Storage, private _loadingservice: LoadingService,
    private _router: Router, private _cdr: ChangeDetectorRef,
    private _route: ActivatedRoute) {
    this._route.data.subscribe(data => {

      this.upcomingData = data['surveydata'];
      this.upcomingDataLength = this.upcomingData.length;
    });
    
    this.companieslist = this._authservice.companylist;

    if(this.companieslist[0] !== undefined) {
      this.activecompany = this.companieslist[0].name;
    }
    this._loadingservice.present();
    this._cdr.markForCheck();

  }

  ngOnInit() {

  }
  ionViewDidEnter() {
    this.getAsyncData();

  

  }

  async getAsyncData() {

    

    

    this.loggedinUserId = await <any>this._authservice.getItems('USER_ID');
    this.companyId = await <any>this._authservice.getItems('COMPANY_ID');
console.log('dinesh >> ' + this.companyId);
    this._commonApiService.getDashboardUserSurvey(this.companyId, 'U').subscribe(id1 => {
      this.upcomingData = id1;
      this.upcomingDataLength = this.upcomingData.length;
     
      this.items[0].size = this.upcomingDataLength;
      this._cdr.markForCheck();
    });

 
    this._commonApiService.getDashboardUserSurvey(this.companyId, 'L').subscribe(id2 => {
      this.liveData = id2;
      this.liveDataLength = this.liveData.length;
     
      this.items[1].size = this.liveDataLength;
      this._cdr.markForCheck();
    });
  
    this._commonApiService.getDashboardUserSurvey(this.companyId, 'C').subscribe(id3 => {
      this.closeData = id3;
      this.closeDataLength = this.closeData.length;
     
      this.items[2].size = this.closeDataLength;
      this._cdr.markForCheck();
    });
    this._loadingservice.dismiss();
  }

  addSurvey() {
    this._router.navigateByUrl('/start-survey');
  }


  toggleClick(clickedItem: any): void {
    this._loadingservice.present();

    for (const item of this.items) {
      item.isClicked = false;
    }

    clickedItem.isClicked = true;

    if (clickedItem.id === 1) {

      this._commonApiService.getDashboardUserSurvey(this.companyId, clickedItem.status).subscribe(id1 => {
        this.upcomingData = id1;
        this.upcomingDataLength = this.upcomingData.length;
        this.items[0].isClicked = true;
        this._loadingservice.dismiss();
        this._cdr.markForCheck();
      });

    } else if (clickedItem.id === 2) {
      this._commonApiService.getDashboardUserSurvey(this.companyId, clickedItem.status).subscribe(id2 => {
        this.liveData = id2;
        this.liveDataLength = this.liveData.length;
        this.items[1].isClicked = true;
        this._loadingservice.dismiss();
        this._cdr.markForCheck();
      });
    } else if (clickedItem.id === 3) {
      this._commonApiService.getDashboardUserSurvey(this.companyId, clickedItem.status).subscribe(id3 => {
        this.closeData = id3;
        this.closeDataLength = this.closeData.length;
        this.items[2].isClicked = true;
        this._loadingservice.dismiss();
        this._cdr.markForCheck();
      });
    }



  }

  goPreview(item: any) {
    console.log('object KAKAK' + JSON.stringify(item));
    this._router.navigateByUrl(`/preview/${item.survey_id}`);
  }

  edit(item: any) {
    this._router.navigateByUrl(`/compile-survey-questions/${item.survey_id}`);
  }


  stopSurvey(item) {
 
    this.presentAlertConfirm(item.survey_id);
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
              this._commonApiService.getDashboardUserSurvey(this.companyId, 'C').subscribe(id3 => {
                this.closeData = id3;
                this.closeDataLength = this.closeData.length;
                this.items[0].isClicked = false;
                this.items[1].isClicked = false;
                this.items[2].isClicked = true;

                this.items[2].size = this.closeDataLength;
                this.items[1].size = this.liveDataLength - 1;

                this._commonApiService.getDashboardUserSurvey(this.companyId, 'L').subscribe(id2 => {
                  this.liveData = id2;
                  this.liveDataLength = this.liveData.length;
                  this.items[1].isClicked = true;
                  this._cdr.markForCheck();
                });

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
    this._router.navigateByUrl(`survey-results/${item.survey_id}`);
  }


  goLive(item) {
    
    this.presentGoLiveAlertConfirm(item.survey_id);
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
                this._commonApiService.getDashboardUserSurvey(this.companyId, 'L').subscribe(id4 => {
               this.liveData = id4;
               this.liveDataLength = this.liveData.length;
               this.items[1].isClicked = true;

               this.items[1].size = this.liveDataLength;
               this.items[0].size = this.upcomingDataLength - 1;

               this._commonApiService.getDashboardUserSurvey(this.companyId, 'U').subscribe(id1 => {
                this.upcomingData = id1;
                this.upcomingDataLength = this.upcomingData.length;
                this.items[0].isClicked = true;
                this._cdr.markForCheck();
              });

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



  async chooseCompany() {



    const modal = await this._modalcontroller.create({
      component: AllCompaniesComponent,
      componentProps: {
        data: this.companieslist
      }
    });
  
    modal.onDidDismiss().then((result) => {
      console.log('The result:', result);
      console.log('The json result:', JSON.stringify(result));
  
      this.selectedCompanyData = result.data;

      this.storage.set('COMPANY_ID', this.selectedCompanyData.item.id);
      this.storage.set('COMPANY_NAME', this.selectedCompanyData.item.name);

      this.activecompany = this.selectedCompanyData.item.name;
      this._cdr.markForCheck();
      this._loadingservice.present();
      this.getAsyncData();
      this.companyselected = true;
    
      this._cdr.markForCheck();
  });
  
    return await modal.present();
  }

  // {"data":{"item":{"id":2,"name":"Hero Moters"}}}

}
