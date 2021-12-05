import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {OrderService} from "../../services/order.service";
import {ProductModelServer} from "../../models/product.model";

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent implements OnInit {
  message: any;
  orderId: any;
  products: ProductResponseModel[]=[];
  cartTotal: any;
  constructor(private router: Router, private orderService: OrderService) {
    const navegation = this.router.getCurrentNavigation();



    const state = navegation?.extras.state as {
      message: string,
      products: ProductResponseModel[],
      orderId: number,
      total: number
    };
    this.message = state.message;
    this.products = state.products;
    console.log(this.products);
    this.orderId = state.orderId;
    this.cartTotal = state.total;
  }

  ngOnInit(): void {
  }

}

interface ProductResponseModel{
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantityOrdered: number;
}
