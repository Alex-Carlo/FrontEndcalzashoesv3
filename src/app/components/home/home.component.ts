import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {tsCastToAny} from "@angular/compiler-cli/src/ngtsc/typecheck/src/ts_util";
import {Router} from "@angular/router";
import {CartService} from "../../services/cart.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: any[] = [];


  constructor(private productService: ProductService,
              private cartService: CartService,
              private router: Router) { }

  ngOnInit(): void {
  this.productService.getAllProducts(3).subscribe((data: any) => {

  this.products = data.products;

  console.log(this.products);

  });

  }



  selectedProducts(id: Number) {
  this.router.navigate(['/product', id]).then();
  }

  AddtoCart(id: number) {
    this.cartService.addProductCart(id);
  }
}
