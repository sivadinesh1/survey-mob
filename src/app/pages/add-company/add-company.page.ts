import { Router } from '@angular/router';
import { SharedService } from './../../services/shared.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.page.html',
  styleUrls: ['./add-company.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCompanyPage implements OnInit {

  
  submitForm: FormGroup;
  roleslist = [{id: '2', role: 'Client Admin'}, {id: '1', role: 'Member'}, {id: '3', role: 'Moderator'}];
  loggedinUserId: any;
  companyId: any;
  companyname: any;

  responsemsg: any;

  apiresponsedata: any;


  selectedFile = 'Choose a File...';
  filesizeAlert: any;

  validateAllFormFields = SharedService.validateAllFormFields;
  isFieldInvalidTouched = SharedService.isFieldInvalidTouched;

  constructor(private _fb: FormBuilder, private _cdr: ChangeDetectorRef, 
      private _authservice: AuthService, private _commonApiService: CommonApiService,
      private _router: Router, private _loadingservice: LoadingService,
    ) { }

  ngOnInit() {
    this.submitForm = this._fb.group({
      company_name: new FormControl(null, Validators.required),

      company_shortcode: new FormControl(null, Validators.required),
      company_tagline: new FormControl(null, Validators.required),
      company_phone: new FormControl(null, Validators.required),
      company_email: new FormControl(null),
      company_website: new FormControl(null),
      isactive: new FormControl('Y'),
      addressline1: new FormControl(null, Validators.required),
      addressline2: new FormControl(null),
      city: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
      pincode: new FormControl(null, Validators.required),
      loggedinuser: new FormControl(null, Validators.required),
      file: new FormControl(null, Validators.required),
      filename: new FormControl(null),
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

  addCompany() {
    if (!this.submitForm.valid) {
      this.validateAllFormFields(this.submitForm);
      this.responsemsg = 'Wrong or Missing information. Please check the form.';
    } else {
      
    this._commonApiService.addCompany(this.submitForm.value).subscribe(data => {
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


onFileChange(event) {
  this.filesizeAlert = '';
  const reader = new FileReader();
  this.selectedFile = 'Choose a File...';

  if (event.target.files && event.target.files.length) {
    const [file] = event.target.files;

    reader.readAsDataURL(file);

    const FileSize = file.size / 1024 / 1024; // in MB

    // if (FileSize > 2) {
    //   this.filesizeAlert = 'Image size exceeds 2MB, consider lesser file size';
    //   return false;
    // }

    console.log('object...............' + file.name);

    reader.onload = () => {
      this.submitForm.patchValue({
        file: reader.result,
        filename: file.name
      });

      this.selectedFile = file.name;
      // need to run CD since file load runs outside of zone
      this._cdr.markForCheck();
    };
  }

}

}
