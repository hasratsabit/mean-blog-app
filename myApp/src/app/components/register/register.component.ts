import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  // This allows us to use the form in HTML
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) {

    this.createForm();
    this.onRegisterSubmit();

    }



/***********************
  Create The Form
************************/

  createForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail // From validate Email function bellow.
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      confirm: ['', Validators.required ]
    }, { validator: this.matchingPasswords('password', 'confirm')});
  }

/**************************/


/***********************
  Email Validation
************************/

  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // If it passes valid username test
    if(regExp.test(controls.value)){
      return null; // Return null for errors
    }else{
      // Otherwise return true for errors
      return { 'validateEmail': true }
    }
  }

/**************************/


/***********************
  Username Validation
************************/

  validateUsername(controls) {
    // Username Expression
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    // If it passes valid email test
    if(regExp.test(controls.value)){
      return null; // Return null for errors
    }else{
      // Otherwise return true for errors
      return { 'validateUsername': true }
    }
  }

/**************************/



/***********************
  Password Validation
************************/

  validatePassword(controls) {
    // Password validation expression
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    // If it passes valid email test
    if(regExp.test(controls.value)){
      return null; // Return null for errors
    }else{
      // Otherwise return true for errors
      return { 'validatePassword': true }
    }
  }

/**************************/



/***********************
  Matching Password
************************/

  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      // If the confirm field is matching the password field
      if(group.controls[confirm].value === group.controls[password].value){
        return null; // Return null for errors
      }else{
        return {'matchingPasswords': true}
      }
    }
  }

/**************************/


    // Register
    onRegisterSubmit() {

    }

  ngOnInit() {
  }

}
