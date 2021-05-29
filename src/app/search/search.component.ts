import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { ProductService } from "../shared/product.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  formModel: FormGroup = this.fb.group({
    title: ['', Validators.minLength(3)],
    price: [null, this.positiveNumberValidator],
    category: ['-1']
  });

  categories: string[];

  constructor(private fb: FormBuilder, private productService: ProductService) {

  }

  ngOnInit(): void {
    this.categories = this.productService.getAllCategories();
  }

  positiveNumberValidator(control: FormControl): any {
    if (!control.value) {
      return null;
    }

    let price = parseInt(control.value);
    if (price > 0) {
      return null;
    } else {
      return {positiveNumber: true};
    }
  }

  search() {
    if (this.formModel.valid) {
      this.productService.searchEvent.emit(this.formModel.value);
    }
  }

}
