import { Component, OnInit } from '@angular/core';
import {CartModelServer} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartData: any;
  cartTotal: any;
  subTotal: any;

  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total =>this.cartTotal=total);

  }

  deleteFromCart(i: number) {
    this.cartService.DeleteProductFromCart(i);
  }

  changeQuantity(i: number, increase: boolean) {
   this.cartService.UpdateCartItems(i, increase);
  }
}
