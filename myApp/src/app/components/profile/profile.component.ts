import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  username;
  email;

  constructor(
    private authService: AuthService
  ) { }

  // This function will every time a user signes in.
  ngOnInit() {
    this.authService.getProfile().subscribe(data => {
      this.username = data.user.username;
      this.email = data.user.email;
    })
  }

}
