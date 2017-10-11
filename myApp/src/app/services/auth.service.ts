import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";

@Injectable()
export class AuthService {


  domain = "http://localhost:3000";
  authToken;
  user;

  constructor(
    private http: Http
  ) { }


/**********************
	Post Request
***********************/

  registerUser(user){
    return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());
  }

/**************************/



/**************************
	Check Email Availability.
***************************/

// Function to check if e-mail is taken
checkEmail(email) {
  return this.http.get(this.domain + '/authentication/checkEmail/' + email).map(res => res.json());
}

/**************************/


/******************************
	Check Username Availability.
******************************/

// Function to check if username is taken
checkUsername(username) {
  return this.http.get(this.domain + '/authentication/checkUsername/' + username).map(res => res.json());
}

/**************************/

/*********************************
  Login Request.
**********************************/

// Function to login user
login(user) {
  return this.http.post(this.domain + '/authentication/login', user).map(res => res.json());
}

/**************************/



/*********************************
	Store User Data in the browser.
**********************************/

// Function to store user's data in client local storage
 storeUserData(token, user) {
   localStorage.setItem('token', token); // Set token in local storage
   localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
   this.authToken = token; // Assign token to be used elsewhere
   this.user = user; // Set user to be used elsewhere
 }
/**************************/


}
