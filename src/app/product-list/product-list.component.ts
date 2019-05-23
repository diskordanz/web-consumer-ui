import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Product, CartItem } from '../models';
import { ActivatedRoute } from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';

const pathToImage = "../../assets/img/"

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  state$: Observable<object>; 
  products: Product[];
  header: HeaderComponent;
  item: CartItem;
  item2: CartItem;
  subscription: Subscription;

  constructor(private http: HttpClient, public router: ActivatedRoute, private s: CommonService, private auth: AuthService) { }
  public pathToImage = pathToImage;

  ngOnInit() {
    console.log("hi")
    this.state$ = this.router.paramMap
    .pipe(map(() => window.history.state))

    if(window.history.state.category_id){

      if(window.history.state.category_id == 1){
      this.s.listProducts(window.history.state.name, 20,0)
      .subscribe((data: Product[]) => {
        this.products = data;});
      }
      else {
      this.s.listProductsByCategory(window.history.state.category_id, window.history.state.name, 20,0)
      .subscribe((data: Product[]) => {
        this.products = data;});
      } 
  }
  else{
    this.s.listProducts("", 20,0)
    .subscribe((data: Product[]) => {
      this.products = data;});
  }
}

  addToCart(product: Product){
    this.item = {
        id: 0,
        consumer_id: this.auth.getUserID(localStorage.getItem('token')),
        product: product,
        count: 1,
      };

      this.s.getCartItem(this.item).subscribe((data: CartItem) => {
        this.item2 = data;
        console.log(this.item2);
      
      if(this.item2.id == 0){
        this.s.createCartItem(this.item).subscribe((data :CartItem) => {
          this.item = data;
          console.log("create");
        });
      } 
      else {
        this.item2.count++;
        this.s.updateCartItem(this.item2).subscribe((data :CartItem) => {
          this.item2 = data;
        console.log("update"); 
      });
    }});
  } 
}