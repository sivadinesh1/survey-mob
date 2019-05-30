import { Router } from '@angular/router';
import { SharedService } from './../../services/shared.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.page.html',
  styleUrls: ['./add-member.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMemberPage implements OnInit {

  
  submitForm: FormGroup;
  roleslist = [{id: '2', role: 'Client Admin'}, {id: '1', role: 'Member'}, {id: '3', role: 'Moderator'}];
  loggedinUserId: any;
  companyId: any;
  companyname: any;

  responsemsg: any;

  apiresponsedata: any;

  validateAllFormFields = SharedService.validateAllFormFields;
  isFieldInvalidTouched = SharedService.isFieldInvalidTouched;

  constructor(private _fb: FormBuilder, private _cdr: ChangeDetectorRef, 
      private _authservice: AuthService, private _commonApiService: CommonApiService,
      private _router: Router, private _loadingservice: LoadingService,
    ) { }

  ngOnInit() {
    this.submitForm = this._fb.group({
      name: new FormControl(null, Validators.required),

      phone: new FormControl(null, Validators.required),
      email: new FormControl(null),
      role: new FormControl(null, Validators.required),
      companyid: new FormControl(null),
      companyname: new FormControl(null),
      loggedinuser: new FormControl(null, Validators.required),
    });

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

    this._cdr.markForCheck();
  }

  addMember() {



    if (!this.submitForm.valid) {
      this.validateAllFormFields(this.submitForm);
      this.responsemsg = 'Wrong or Missing information. Please check the form.';
    } else {
   

   
      
    this._commonApiService.addMember(this.submitForm.value).subscribe(data => {
      this.apiresponsedata = data;
      console.log('object<<<<< ' + JSON.stringify(this.apiresponsedata));

      if (this.apiresponsedata.result === 'OK') {
      
        this.submitForm.reset();
       this._loadingservice.presentToastWithOptions('Member Created Successfully.', 'middle', false, '');
       this.goDashboard();
        this._cdr.markForCheck();
      }

      });
  }

  }


goDashboard() {
  this._router.navigateByUrl(`/dashboard/${this.companyId}`);
}


}
