import { AuthService } from './../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.page.html',
  styleUrls: ['./list-company.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCompanyPage implements OnInit {
  companieslist: any;
  companieslistCount: any;

  loggedinUserId: any;
  companyId: any;

  constructor(private _route: ActivatedRoute, private _cdr: ChangeDetectorRef,
    private _router: Router, private _authService: AuthService,
    ) {
    this._route.data.subscribe(data => {

      this.companieslist = data['companieslist'];
      this.companieslistCount = this.companieslist.length;
    });
  }

  ngOnInit() {
    this.getAsyncData();
    console.log('COMPANIES LIST ' + JSON.stringify(this.companieslist));
    
  }

  async getAsyncData() {

    this.loggedinUserId = await <any>this._authService.getItems('USER_ID');
    this.companyId = await <any>this._authService.getItems('COMPANY_ID');

 
    this._cdr.markForCheck();

  }

  goDashboard() {
    this._router.navigateByUrl(`/dashboard/${this.companyId}`);
  }

  addCompany() {
    this._router.navigateByUrl(`/add-company`);
  }

  edit(item: any) {
    this._router.navigateByUrl(`/edit-company/${item.company_id}`);
  }

}
