import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import {CartModelPublic, CartModelServer} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  cartData: any;
  cartTotal: any;
  authState: any;

  constructor(private cartService: CartService, private userService: UserService) { }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal =total);
    this.cartService.cartData$.subscribe(data =>this.cartData = data);
    this.userService.authState$.subscribe(state=>this.authState = state);
  }

  DeleteProductFromCart(i: number) {
    this.cartService.DeleteProductFromCart(i);
  }
}
