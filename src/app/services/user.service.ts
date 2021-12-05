import { HttpClient } from '@angular/common/http';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NumberLiteralType } from 'typescript';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  auth: boolean = false;
  private SERVER_URL = environment.URL;
  private user: any;
  authState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.auth);
 
  p:any;
  userData$ : any;
  //private userData$: BehaviorSubject<SocialUser|ResponseModel[]> = new BehaviorSubject<SocialUser|ResponseModel[]>([]);

  constructor(private authService: SocialAuthService,
              private httpClient: HttpClient) {
      authService.authState.subscribe(user=>{
        if(user!=null){
          this.auth=true;
          this.authState$.next(this.auth);
          this.userData$.next(user);
        }
      });
  }
  //Login con correo y contrasena
    loginUser(email:string, password:string){
      this.httpClient.post(`${this.SERVER_URL}/auth/login`, {email, password}).subscribe((data:any) => {
        console.log(data)
      });
    }
    //Login con google
    googleLogin(){
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }

    logout(){
      this.authService.signOut();
      this.auth=false;
      this.authState$.next(this.auth);
    }
}

interface ResponseModel{
  token: string;
  complete: string;
  auth: boolean;
  email: string;
  username: string;
  fname: string;
  lname: string;
  photoUrl: string;
  userId: number;
}
