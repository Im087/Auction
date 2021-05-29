import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Product } from '../data-format';
import { ProductService } from "../shared/product.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public products: Observable<Product[]>;
  public imgUrl = 'http://placehold.it/320x150';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.products = this.productService.getProducts();

    this.productService.searchEvent.subscribe(
      params => {this.products = this.productService.search(params);
      }
    );


  }

}
