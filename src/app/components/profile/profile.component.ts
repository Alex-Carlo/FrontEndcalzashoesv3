import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  myUser: any;

  constructor(private authService: SocialAuthService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.authService.authState.subscribe(data=>{
      
      this.myUser = data;
      console.info(this.myUser);
    });
  }

  salir(){
    this.authService.signOut();
  }

}
