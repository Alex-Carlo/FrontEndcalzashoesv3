import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "./product.service";
import {OrderService} from "./order.service";
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs";
import {NavigationExtras, Router} from "@angular/router";
import {CartModelPublic,  CartModelServer} from "../models/cart.model";
import {ProductModelServer} from "../models/product.model";
import {dashCaseToCamelCase} from "@angular/compiler/src/util";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private URL = environment.URL;
  //manejar la informacion de almacenamiento local

  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [{
      id:0,
      incart: 0
    }]
  };

  //Informacion que mantiene el servidor

  private undifined: ProductModelServer = {
    id: 0,
    name: '',
    category: '',
    description: '',
    price: 0,
    image: '',
    quantity: 0,
    images: ''
  }

  private cartDataServer: CartModelServer = {
    total: 0,
    data: [{
      numInCart: 0,
      products: undefined
    }]
  };


cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);


  constructor(private http: HttpClient,
              private productService: ProductService,
              private orderService: OrderService,
              private router: Router,
              private toast: ToastrService,
              private spinner: NgxSpinnerService) {


    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    //Obtener la inforamacion local del usuario
    let info: CartModelPublic;
    info = JSON.parse(<string>localStorage.getItem('cart'));

    //Mirar si la info de la variable es nula
    if(info != null && info != undefined && info.prodData[0].incart != 0){
  //El almacenamiento local no esta vacio y tiene informacion
      this.cartDataClient = info;

      //Recorremos cada entrada y la ponemos en el objeto de datos del carrito

      this.cartDataClient.prodData.forEach(p=> {
        this.productService.getOneProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {
          if(this.cartDataServer.data[0].numInCart==0){
            this.cartDataServer.data[0].numInCart = p.incart;
            this.cartDataServer.data[0].products = actualProductInfo;
            //Calcular total
            this.CalculateTotal();

            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          } else{
            //cartdataserver ya tiene alguna entrada en ella
            this.cartDataServer.data.push({
              numInCart: p.incart,
              products: actualProductInfo
            });
            //crear  la función calculaTotal y reemplázala aquí
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }
          this.cartData$.next({...this.cartDataServer});
        })
      });
    }

  }
  //Agregar producto al carrito
  addProductCart(id:number, quantity?: number){
  //A tener en cuenta:



    this.productService.getOneProduct(id).subscribe(prod =>{
      //Si el carrito esta vacio
      if(this.cartDataServer.data[0].products === undefined){
        this.cartDataServer.data[0].products=prod;
        this.cartDataServer.data[0].numInCart = quantity != undefined ? quantity : 1;
        this.CalculateTotal();
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});
        //Notificacion Toast
        this.toast.success(`${prod.name} agregado al carrito`,'Producto Agregado',{
          timeOut: 1500,
          progressBar:true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    //Si el carrito tiene items:
      else {
        const index = this.cartDataServer.data.findIndex(p=>p.products.id === prod.id); //-1 o un valor positivo
        //Si el item que esta tratando de ingresar esta ya en el carrito, Esto es cuando el valor del index es positivo
        if(index != -1){
          if(quantity != undefined && quantity<=prod.quantity){
          this.cartDataServer.data[index].numInCart =this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
          }else {
            this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
          }
          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
          //Calcula El Total
          this.CalculateTotal();
          this.cartDataClient.total=this.cartDataServer.total;
          //Notificacion Toast
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.toast.info(`${prod.name} cantidad actualizada en el carrito`,'Producto Actualizado',{
            timeOut: 1500,
            progressBar:true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });

        }

        //Si el item no esta en el carrito
        else {
          this.cartDataServer.data.push({
            products: prod,
            numInCart: 1
          });

          this.cartDataClient.prodData.push({
            incart: 1,
            id: prod.id
          });
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          //Mostrar notificacion
          //Notificacion Toast
          this.toast.success(`${prod.name} agregado al carrito`,'Producto Agregado',{
            timeOut: 1500,
            progressBar:true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
          //Calcular la cantidad Total
          this.CalculateTotal();
          this.cartDataClient.total=this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({...this.cartDataServer});

        }
      }
    });
  }

  UpdateCartItems(index: number, increase: boolean){
    let data = this.cartDataServer.data[index];
    if (increase) {
      data.numInCart < data.products.quantity ? data.numInCart++ : data.products.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      //Cacular el total
      this.CalculateTotal();
      this.cartDataClient.total=this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});
    } else {
      data.numInCart--;
      if(data.numInCart < 1){
        //ELIMINAR UN PRODUCTO DEL CARRITO
        this.DeleteProductFromCart(index);
        this.cartData$.next({...this.cartDataServer});
      } else {
        this.cartData$.next({...this.cartDataServer});
        this.cartDataClient.prodData[index].incart = data.numInCart;
        //calcular el total
        this.CalculateTotal();
        this.cartDataClient.total=this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  DeleteProductFromCart(index: number){
    if(window.confirm('Seguro que quieres eliminar el producto?')){
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      //Calcular el total
      this.CalculateTotal();
      this.cartDataClient.total=this.cartDataServer.total;
      if(this.cartDataClient.total == 0){
        this.cartDataClient = {total: 0, prodData: [{incart: 0, id:0}]};
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }else{
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
      if(this.cartDataClient.total == 0){
        this.cartDataServer = {total: 0, data: [{numInCart: 0, products: undefined}]};
        this.cartData$.next({...this.cartDataServer});
      }
      else {
        this.cartData$.next({...this.cartDataServer});
      }
    }
    else{
      //Si no confirma eliminar el producto
      return;
    }
  }

  private calculateTotal(){
    let total = 0;
    this.cartDataServer.data.forEach(p => {
      const {numInCart} = p;
      const {price} = p.products;
      total +=numInCart*price;
    });
    this.cartDataServer.total = total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  checkoutFromCart(userId: number){



    this.http.post(`${this.URL}/orders/payment`, null).subscribe((res:any)=>{
      console.log(res)
      if(res.success){
        console.log("Hola, estoy aqui en el if");
        this.resetServerData();
        this.http.post(`${this.URL}/orders/new`, {
          userId: userId,
          products: this.cartDataClient.prodData
        }).subscribe((data:any)=>{
          this.orderService.getOneOrder(data.order_id).then(prods =>{

            if(data.success){
              const navegationExtras: NavigationExtras = {
                state:{
                  message: data.message,
                  products: prods,
                  orderId: data.order_id,
                  total: this.cartDataClient.total
                }
              };
              //Spinner oculto
              this.spinner.hide().then();
              this.router.navigate(['/thankyou'], navegationExtras).then(p =>{
                this.cartDataClient = {total: 0, prodData: [{incart: 0, id:0}]};
                this.cartTotal$.next(0);
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
              });

            }
          });

        });
      }else {
        console.log("Hola, estoy aqui en el else");
        this.spinner.hide().then();
        this.router.navigateByUrl('/checkout').then();
        //Notificacion Toast
        this.toast.error(`Lo sentimos, hubo un error en la accion`,'Estado',{
          timeOut: 1500,
          progressBar:true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    });
  }


  private resetServerData(){
    this.cartDataServer = {total: 0, data: [{numInCart: 0, products: undefined}]};
    this.cartData$.next({...this.cartDataServer});
  }
  private CalculateTotal() {
    let Total = 0;

    this.cartDataServer.data.forEach(p => {
      const {numInCart} = p;
      const {price} = p.products;
      // @ts-ignore
      Total += numInCart * price;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }
  CalculateSubTotal(index:number): number{
    let subTotal = 0;
    const p = this.cartDataServer.data[index];
    subTotal = p.products.price * p.numInCart;
    return subTotal;
  }

}


interface OrderResponse{
  order_id: number;
  succes: boolean;
  message: string;
  products: [{
    id:string,
    numInCart: string;
  }];
}




