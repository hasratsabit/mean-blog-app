import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { AuthService } from "./auth.service";

@Injectable()
export class BlogService {

  domain = this.authService.domain;
  options;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }


  /**********************
    Create Headers
  ***********************/

    // The header is created to be sent to the backend so the API authenticates the user to get the profile information.
  createAuthenticationHeaders() {
    // The load token method from bellow is called to get the token from the browser when user is signed in
    this.authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
  }

  /******************************
  	Post Blogs Service
  ******************************/
  newBlog(blog){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + '/blogs/newBlog', blog, this.options).map(res => res.json());
  }

  /*****************************/


  /******************************
  	Get Blogs Service
  ******************************/
  getAllBlogs() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/blogs/allBlogs', this.options).map(res => res.json());
  }
  /*****************************/

}
