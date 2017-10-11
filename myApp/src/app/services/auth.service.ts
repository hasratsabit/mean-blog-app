import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";

@Injectable()
export class AuthService {


  domain = "http://localhost:3000";
  authToken;
  user;
  options;

  constructor(
    private http: Http
  ) { }

  /**********************
  	Create Headers
  ***********************/

    // The header is created to be sent to the backend so the API authenticates the user to get the profile information.
  createAuthenticationHeaders() {
    // The load token method from bellow is called to get the token from the browser when user is signed in
    this.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authToken // Attach token
      })
    });
  }

/**************************/



  /**********************
  	Load Token
  ***********************/
  // Function to get token from client local storage
  loadToken() {
    this.authToken = localStorage.getItem('token');; // Get token and asssign to variable to be used elsewhere
  }

  /**************************/



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
  Logout
**********************************/
  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear()
  }


/*********************************
  Login Request.
**********************************/
login(user) {
  return this.http.post(this.domain + '/authentication/login', user).map(res => res.json());
}
/**************************/

/*********************************
	Get Profile Http.
**********************************/

  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/authentication/profile', this.options).map(res => res.json());
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
