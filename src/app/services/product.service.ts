import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {isObservable} from "rxjs/internal-compatibility";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private URL = environment.URL;
  constructor(private http: HttpClient) { }

//obtener todos los productos sin limite

getAllProductsL(){
  return this.http.get(this.URL+'/productos/all');
}

//Obtener todos los productos limitados
  getAllProducts(nResultado=10, page=1){
    return this.http.get(this.URL+'/productos',{
      params: {
        page:page.toString(),
        limit: nResultado.toString()
      }
    });
  }

  //Obtener un solo producto

  getOneProduct(id: number): Observable<any>{

    return this.http.get<any>(this.URL + '/productos/' + id);
  }

  //Obtener productos por categoria

  getProductsCategory(category: string): Observable<any>{
    return this.http.get<any>(this.URL + '/productos/categoria/'+ category +'?limit=10')
  }
}
