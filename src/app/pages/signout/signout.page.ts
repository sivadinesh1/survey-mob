import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.page.html',
  styleUrls: ['./signout.page.scss'],
})
export class SignoutPage implements OnInit {

  constructor(private _authService: AuthService,
    private _router: Router) { }

  ngOnInit() {
    this._authService.logout();
    this._router.navigateByUrl(`/sign-in`);
  }

}
