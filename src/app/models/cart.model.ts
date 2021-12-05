
import {ProductModelServer} from "./product.model";

export interface CartModelServer{
  total:number;
  data: [{
    products: any,
    numInCart: number
  }];
}

export interface CartModelPublic{
  total: number;
  prodData: [
    {
      id: number,
      incart: number
    }
  ];
}
