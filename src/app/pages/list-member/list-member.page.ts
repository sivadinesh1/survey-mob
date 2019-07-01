import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list-member',
  templateUrl: './list-member.page.html',
  styleUrls: ['./list-member.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListMemberPage implements OnInit {

  loggedinUserId: any;
  companyId: any;

  constructor(private _route: ActivatedRoute, private _cdr: ChangeDetectorRef,
    private _router: Router, private _authService: AuthService,) { }

  ngOnInit() {

    this.getAsyncData();
  }

  async getAsyncData() {

    this.loggedinUserId = await <any>this._authService.getItems('USER_ID');
    this.companyId = await <any>this._authService.getItems('COMPANY_ID');

 
    this._cdr.markForCheck();

  }


  goDashboard() {
    this._router.navigateByUrl(`/dashboard/${this.companyId}`);
  }

  addMember() {
    this._router.navigateByUrl(`/add-company`);
  }

}
