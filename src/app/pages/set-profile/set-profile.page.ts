import { LoadingService } from './../../services/loading.service';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';

@Component({
  selector: 'app-set-profile',
  templateUrl: './set-profile.page.html',
  styleUrls: ['./set-profile.page.scss'],
})
export class SetProfilePage implements OnInit {
  submitForm: FormGroup;
  constructor(private _router: Router, private _fb: FormBuilder, 
    private _loadingService: LoadingService,
    private _commonApiService: CommonApiService) { }

  ngOnInit() {
     this.submitForm = this._fb.group({
      firstname: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      companyname: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      language: new FormControl(null, [Validators.required, Validators.minLength(6)]),
   });
  }

  save() {
    this._loadingService
    .presentToastWithOptions(`Congratulations ${this.submitForm.value.firstname}, Your profile has been created.`, 'middle', false, '');
    this._router.navigateByUrl('new-survey');

  }

}
