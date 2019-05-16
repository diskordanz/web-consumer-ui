import { Component, OnInit } from '@angular/core';
import { Category } from '../models';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  categories: Category[];
  public selectedCategory: Category;

  constructor(private router: Router, private s: CommonService) { }

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
}