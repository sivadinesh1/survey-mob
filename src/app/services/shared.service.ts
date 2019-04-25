
import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public static   EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  public static PHONE_REGEX = /^[6-9]\d{9}$/;
  public static GENDER = ['Male', 'Female'];


  constructor() {}

  public static validateAllFormFields(formGroup: FormGroup) {
    console.log('INSIDE ### ');

    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  public static isFieldInvalidTouched(field: any, myForm: FormGroup) {

    console.log('INSIDE field invalid touch ' + field);

    // myForm is your FormGroup variable
    return myForm.get(field).invalid && myForm.get(field).touched;
  }

}
