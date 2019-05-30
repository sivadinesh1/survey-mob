import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from './../../services/shared.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.page.html',
  styleUrls: ['./edit-company.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCompanyPage implements OnInit {

  
  submitForm: FormGroup;
  roleslist = [{id: '2', role: 'Client Admin'}, {id: '1', role: 'Member'}, {id: '3', role: 'Moderator'}];
  loggedinUserId: any;
  companyId: any;
  companyname: any;

  responsemsg: any;

  apiresponsedata: any;

  companydata: any;

  validateAllFormFields = SharedService.validateAllFormFields;
  isFieldInvalidTouched = SharedService.isFieldInvalidTouched;

  constructor(private _fb: FormBuilder, private _cdr: ChangeDetectorRef, 
      private _authservice: AuthService, private _commonApiService: CommonApiService,
      private _router: Router, private _loadingservice: LoadingService, private _route: ActivatedRoute
    ) { 
      this._route.data.subscribe(data => {

        this.companydata = data['companydata'][0];
        
     
      });
    }

  ngOnInit() {

console.log('object>>>>>>> ' + JSON.stringify(this.companydata));

    this.submitForm = this._fb.group({
      company_id : new FormControl(this.companydata.company_id, Validators.required),
      company_name: new FormControl(this.companydata.company_name, Validators.required),

      company_shortcode: new FormControl(this.companydata.company_shortcode, Validators.required),
      company_tagline: new FormControl(this.companydata.company_tagline, Validators.required),
      company_phone: new FormControl(this.companydata.company_phone, Validators.required),
      company_email: new FormControl(this.companydata.company_email),
      company_website: new FormControl(this.companydata.company_website),
      isactive: new FormControl(this.companydata.isactive),
      
      city: new FormControl(this.companydata.city, Validators.required),
      state: new FormControl(this.companydata.state, Validators.required),
      pincode: new FormControl(this.companydata.pincode, Validators.required),
      loggedinuser: new FormControl(null, Validators.required),
      addresslineone: new FormControl(this.companydata.addressline1, Validators.required),
      addresslinetwo: new FormControl(this.companydata.addressline2),
    });
    
    
    this._cdr.markForCheck();
    this.getAsyncData();

  }

  ionViewDidEnter() {
    this.getAsyncData();
  }

  async getAsyncData() {
    this.loggedinUserId = await <any>this._authservice.getItems('USER_ID');
    this.companyId = await <any>this._authservice.getItems('COMPANY_ID');
    this.companyname = await <any>this._authservice.getItems('COMPANY_NAME');

    this.submitForm.patchValue({
      loggedinuser: this.loggedinUserId.toString(),
      companyid: this.companyId,
      companyname: this.companyname

    });

    
  

    // this._commonApiService.getCompanyDetail(this.companyId).subscribe(data => {
    //   const tempdata = data[0];

    //   this.submitForm.patchValue({
    //     loggedinuser: this.loggedinUserId.toString(),
    //     companyid: this.companyId,
    //     companyname: this.companyname,
    //     company_shortcode: tempdata.company_shortcode,
    //     company_tagline: tempdata.company_tagline,
    //     company_phone: tempdata.company_phone,
    //     company_email: tempdata.company_email,
    //     company_website: tempdata.company_website,
    //     addresslineone: tempdata.addressline1,
    //     addresslinetwo: tempdata.addressline2,
    //     city: tempdata.city,
    //     state: tempdata.state,
    //     pincode: tempdata.pincode,
    //   });

    // });

    this._cdr.markForCheck();

  }

  editCompany() {
    if (!this.submitForm.valid) {
      this.validateAllFormFields(this.submitForm);
      this.responsemsg = 'Wrong or Missing information. Please check the form.';
    } else {
      
    this._commonApiService.editCompany(this.submitForm.value).subscribe(data => {
      this.apiresponsedata = data;
      console.log('object<<<<< ' + JSON.stringify(this.apiresponsedata));

      if (this.apiresponsedata.result === 'OK') {

        this._authservice.companylist.push({'id': this.apiresponsedata.company_id, 'name': this.submitForm.value.company_name});
      
        this.submitForm.reset();
       this._loadingservice.presentToastWithOptions('Company Created Successfully.', 'middle', false, '');
       this.goDashboard();
        this._cdr.markForCheck();
      }

      });
  }

  }


goDashboard() {
  this._router.navigateByUrl(`/list-company/${this.loggedinUserId}`);
}


}
