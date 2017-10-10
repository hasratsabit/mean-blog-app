import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  // This allows us to use the form in HTML
  form: FormGroup;
  message; // Variable hold success and errors messages
  messageClass; // Adds bootstrap classes based on success and errors
  processing = false; // Locks the button when processes a registeration.
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.createForm();

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



/****************************
  Disable and Enable Form
*****************************/

  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

/**************************/





/****************************
  Register User Post Request
*****************************/

  onRegisterSubmit() {
    // Getting all input field values and storing in user object.
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value,
      confirm: this.form.get('confirm').value
    }

    this.authService.registerUser(user).subscribe(data => {
      if(!data.success){ // If it is not registered
        this.processing = false;
        this.enableForm(); // Enable form for edit if there is error
        this.messageClass = 'alert alert-danger';
        this.message = data.message; // This comes from backend API.
      }else { // If registered
        this.processing = true;
        this.disableForm(); // Disable when form is processing
        this.messageClass = 'alert alert-success';
        this.message = data.message; // This comes from backend API.
        // Then redirect to Login page.
        setTimeout(() => {
          this.router.navigate(['/login']); // Redirect to login view
        }, 2000);
      }
    });
  }


/**************************/



/****************************
  Check Email Availability
*****************************/

checkEmail() {
  // Function from authentication file to check if e-mail is taken
  this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
    // Check if success true or false was returned from API
    if (!data.success) {
      this.emailValid = false; // Return email as invalid
      this.emailMessage = data.message; // Return error message
    } else {
      this.emailValid = true; // Return email as valid
      this.emailMessage = data.message; // Return success message
    }
  });
}

/**************************/


/****************************
  Check Username Availability
*****************************/

checkUsername() {
  // Function from authentication file to check if username is taken
  this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
    // Check if success true or success false was returned from API
    if (!data.success) {
      this.usernameValid = false; // Return username as invalid
      this.usernameMessage = data.message; // Return error message
    } else {
      this.usernameValid = true; // Return username as valid
      this.usernameMessage = data.message; // Return success message
    }
  });
}

/**************************/

  ngOnInit() {
  }

}
