import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { AuthGuard } from "../../guard/auth.guard";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  messageClass;
  message;
  processing = false;
  form: FormGroup;
  previousUrl // Variable stores the url user trying to access.

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) {
      this.createForm();
    }


/******************************
  Form Validation
******************************/

  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

/*****************************/


/******************************
	Disable Form
******************************/

  disableForm() {
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }

/*****************************/


/******************************
	Disable Form
******************************/

  enableForm() {
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }

/*****************************/


  // Functiont to submit form and login user
  onLoginSubmit() {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm(); // Disable form while being process
    // Create user object from user's input
    const user = {
      username: this.form.get('username').value, // Username input field
      password: this.form.get('password').value // Password input field
    }

    // Function to send login data to API
    this.authService.login(user).subscribe(data => {
      // Check if response was a success or error
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = data.message; // Set error message
        this.processing = false; // Enable submit button
        this.enableForm(); // Enable form for editting
      } else {
        this.messageClass = 'alert alert-success'; // Set bootstrap success class
        this.message = data.message; // Set success message
        // Function to store user's token in client local storage
        this.authService.storeUserData(data.token, data.user);
        // After 2 seconds, redirect to dashboard page
        setTimeout(() => {
          if(this.previousUrl){
            // If there is a previous url when a user loggedin, redirect them to that url.
            this.router.navigate([this.previousUrl]);
          }else{
            this.router.navigate(['/dashboard']); // Navigate to dashboard view
          }
        }, 2000);
      }
    });
  }



  ngOnInit() {
    // As soon as the browser is loaded, we check for url that user may searched.
    if(this.authGuard.redirectUrl) {
      this.messageClass = "alert alert-danger";
      this.message = "You must be logged in to view this page";
      this.previousUrl = this.authGuard.redirectUrl; // Use this variable in the login above.
      this.authGuard = undefined;
    }
  }

}
