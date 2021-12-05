import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {CheckoutComponent} from "./components/checkout/checkout.component";
import {ThankyouComponent} from "./components/thankyou/thankyou.component";
import {ProductComponent} from "./components/product/product.component";
import {CartComponent} from "./components/cart/cart.component";
import { ShopComponent } from './components/shop/shop.component';
import { QuienesSomosComponent } from './components/quienes-somos/quienes-somos.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileGuard } from './guard/profile.guard';

const routes: Routes = [
  {
    path:'', component:HomeComponent
  },
  {
    path:'product/:id', component: ProductComponent
  },
  {
    path:'shop/:category', component: ShopComponent
  },
  {
    path:'header', component: HeaderComponent
  },
  {
    path:'cart', component: CartComponent
  },
  {
    path:'footer', component: FooterComponent
  },
  {
    path:'checkout', component: CheckoutComponent
  },
  {
    path:'thankyou', component: ThankyouComponent
  },
  {
    path:'login', component: LoginComponent
  },
  {
    path:'profile', component: ProfileComponent, canActivate:[ProfileGuard]
  },
  {
    path:'quienes', component: QuienesSomosComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
