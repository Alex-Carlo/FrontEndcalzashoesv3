import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private products: productResponseModel[]=[];
  private url = environment.URL;
  constructor(private http: HttpClient) {

  }
  getOneOrder(OrderId:number){
  return this.http.get<productResponseModel[]>(this.url +'/orders/'+ OrderId).toPromise()
  }
}

interface productResponseModel{
  id: number,
  title: string,
  description:string;
  price: number;
  quantityOrdered:number;
  image: string
}
