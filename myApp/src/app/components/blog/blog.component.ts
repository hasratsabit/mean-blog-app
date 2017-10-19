import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { BlogService } from "../../services/blog.service";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingBlogs = false;
  form;
  blogPosts;
  processing = false;
  username; // Getting it by authservice for logged in user.

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogServce: BlogService,
  ) {
      // Fire the function as soon as the page loads.
      this.createNewForm();
    }


  /******************************
    Build The Blog Form
  ******************************/
  createNewForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])]
    })
  }


  disableForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  enableForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  alphaNumericValidation(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'alphaNumericValidation': true }
    }
  }
  /******************************/

  /******************************
  	Title
  ******************************/

  newBlogForm() {
    this.newPost = true;
  }

  onBlogSubmit() {
    this.processing = true;
    this.disableForm();
    // Creating the blog object.
    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.username // This comes from logged in user.
    }

    // Sending Post request using the newBlog method in the blogServce.
    this.blogServce.newBlog(blog).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm()
      }else{
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.getAllBlogs() // The method is recalled to update the feed with new blog created.
        setTimeout(() => {
          this.newPost = false;
          this.processing = false;
          this.message = false;
          this.form.reset();
          this.enableForm();
        }, 2000)
      }
    })
  }

  goBack() {
    window.location.reload();
  }

  /******************************
  	Get All Blogs
  ******************************/
  getAllBlogs() {
    this.blogServce.getAllBlogs().subscribe(data => {
      this.blogPosts = data.blogs;
    })
  }

  /*****************************/


  /******************************
  	Reload All Blogs
  ******************************/
  reloadBlogs() {
    this.loadingBlogs = true;
    this.getAllBlogs(); // Fire this function every time the reload is pressed.
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 2000)
  }

  /*****************************/



  ngOnInit() {
    // Get the logged in username.
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
    });

    this.getAllBlogs() // Call the method to load all the blogs when the page loads.
  }

}
