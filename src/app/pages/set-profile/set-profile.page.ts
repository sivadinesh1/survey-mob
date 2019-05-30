import { AuthService } from '../../services/auth.service';
import { LoadingService } from './../../services/loading.service';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonApiService } from '../../services/common-api.service';

@Component({
  selector: 'app-set-profile',
  templateUrl: './set-profile.page.html',
  styleUrls: ['./set-profile.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetProfilePage implements OnInit {
  submitForm: FormGroup;
  apiresponse: any;
  loading = false;
  phonenumber: any;
  userid: any;

  constructor(private _router: Router, private _fb: FormBuilder,  private route: ActivatedRoute,
    private _loadingService: LoadingService, private _cdr: ChangeDetectorRef,
    private _authservice: AuthService,
    private _commonApiService: CommonApiService) { }

  ngOnInit() {
      this.phonenumber =  this.route.snapshot.params['phonenumber'];

     this.submitForm = this._fb.group({
      phonenumber: new FormControl( this.phonenumber, [Validators.required]),
      firstname: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      companyname: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      language: new FormControl('english', [Validators.required]),
   });
  }

  save() {
    this._loadingService
    .presentToastWithOptions(`Congratulations ${this.submitForm.value.firstname}, Your profile has been created.`, 'middle', false, '');
    this._router.navigateByUrl('new-survey');

  }

  onSubmit() {
    this.loading = true;
    // debugger;
    this._commonApiService.addUser(this.submitForm.value)
    .subscribe(
      data => {
        this.apiresponse = data;
        console.log('object >>> ' + JSON.stringify(this.apiresponse));


        if (this.apiresponse.result === 'OK') {
          this.loading = false;
          this.userid = this.apiresponse.newuserid;
          this._authservice.loginNotify(this.userid, this.submitForm.value.firstname, '', '');

          this._router.navigateByUrl(`/new-survey`);
        }

      }, error => {
        this.loading = false;
        console.log('error while apply jobs..' );
      }
    );

  }

}
