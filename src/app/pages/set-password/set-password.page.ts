import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.page.html',
  styleUrls: ['./set-password.page.scss'],
})
export class SetPasswordPage implements OnInit {


  passwordType = 'password';
  passwordShown = false;

  submitForm: FormGroup;

  constructor(private _fb: FormBuilder, private _router: Router) { }

  ngOnInit() {

    this.submitForm = this._fb.group({
       'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });

  }

  togglePassword() {
    if (this.passwordShown) {
      this.passwordShown = false;
      this.passwordType = 'password';
    } else {
      this.passwordShown = true;
      this.passwordType = 'text';
    }
  }

 
  onSubmit() {
    

  }
  setPassword() {
    this._router.navigateByUrl('set-profile');
  }
}
