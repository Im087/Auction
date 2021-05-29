import { Injectable, EventEmitter, Output } from '@angular/core';
import { Product, Comment, SearchFilter } from '../data-format';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  searchEvent: EventEmitter<SearchFilter> = new EventEmitter();

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  getProducts(): Observable<any> {
    return this.http.get("/api/products");
  }

  getProduct(id: number): Observable<any> {
    return this.http.get(`/api/product/${id}`);
  }

  getCommentsByProductId(id: number): Observable<any> {
    return this.http.get(`/api/product/${id}/comments`);
  }

  getAllCategories(): string[] {
    return ['A', 'B', 'C'];
  }

  search(params: SearchFilter): Observable<any> {``
    return this.http.get("/api/products", {params: this.encodeParams(params)});
  }

  encodeParams(params: SearchFilter): HttpParams {
    let result: HttpParams;
    result = Object.keys(params).filter(key => params[key]).reduce((sum: HttpParams, key: string) => {
      sum = sum.append(key, params[key]);
      return sum;
    }, new HttpParams());

    return result;
  }

}
