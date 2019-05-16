import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, CartItemByFranchise } from '../models'
import { CommonService } from '../services/common.service';
import { AuthService } from '../services/auth.service';
import { count } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  categories: Category[];
  cart: CartItemByFranchise[];
  public selectedCategory: Category;
  public cartCount: number;

  constructor(private router: Router, private s: CommonService, private auth: AuthService) { }

  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
  }

  isLogged():boolean{
    return localStorage.getItem('token') != null
  }
  
  notLogged(){
    return localStorage.getItem('token') == null
  }
  ngOnInit() {
    var id = this.auth.getUserID(localStorage.getItem('token')) 
    this.s.getCart(id, 50, 0).subscribe((data: CartItemByFranchise[]) => {
      this.cart = data;
      this.cartCount = this.count(this.cart);
    });

    this.selectedCategory ={
      id: 0,
      name: 'All categories'};
      
    this.s
      .listCategories()
      .subscribe((data: Category[]) => {
        this.categories = data;
        this.selectedCategory=this.categories[0];
    });
  }

  public selectCategory(newCategory) {
    this.selectedCategory = newCategory;
  }

  public search(text: string) {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigateByUrl('/products',{state: {name: text, category_id: this.selectedCategory.id}}));  
  }

  public count(c: CartItemByFranchise[]):number{
    let count:number=0;
    if (!this.auth.isLogged()){
      c.forEach(element => {
        element.cart_items.forEach(el => {
          count=count + el.count;    
        });
      });

    }
    return count;
  }
}