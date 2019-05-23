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

  constructor(private router: Router, private s: CommonService) { }

  
  ngOnInit() {      
    this.s
      .listCategories()
      .subscribe((data: Category[]) => {
        this.categories = data;
    });
  }

  public search(category: Category) {
    this.router.navigateByUrl('/products',{state: {name: "", category_id: category.id}});  
}
}