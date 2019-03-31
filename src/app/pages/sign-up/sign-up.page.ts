import { CommonApiService } from './../../services/common-api.service';

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  constructor(private _router: Router, private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService) { }

  ngOnInit() {
  }

setPassword() {
  this._router.navigateByUrl('set-password');
}

}
