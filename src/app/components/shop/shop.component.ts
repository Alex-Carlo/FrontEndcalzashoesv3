import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  products: any;
  n: number = 1;
  category: any;
  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    
    this.route.paramMap.pipe(
      map((param: ParamMap) => {
        // @ts-ignore
        return param.params.category;
      })
    ).subscribe(prodCategory => {
      this.category = prodCategory;
      if(this.category == 'all'){
        this.productService.getAllProductsL().subscribe(data => {
          this.products = data;
          console.log(this.products);
        })
      }else{
        this.productService.getProductsCategory(this.category).subscribe(prod => {
          this.products = prod;
          
        });
      }
      
    });


    


  }

  addToCart(id: number){
    this.cartService.addProductCart(id);
  }

}
