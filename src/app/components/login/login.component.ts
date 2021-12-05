import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = '';
  pass: string = '';
  constructor(private authService: SocialAuthService, private router: Router, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.authService.authState.subscribe(state=>{
      if(state){
        this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/profile');
      }else{
        this.router.navigateByUrl('/login');
      }
    });
  }
  login(f:NgForm){
    const email: string = this.email;
    const pass: string = this.pass;
    if(f.invalid){
      return;
    }
    f.reset();
    this.userService.loginUser(email, pass)

  }
  signInGoogle(){
    this.userService.googleLogin();
  }

}
