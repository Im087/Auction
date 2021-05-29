import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {Observable} from "rxjs";
import { Product, Comment} from '../data-format';
import { ProductService } from "../shared/product.service";
import { WebsocketService } from "../shared/websocket.service";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  public product: Product;
  public comments: Comment[];
  public newRating: number = 0;
  public newComment: string = "";
  public isCommentHidden: boolean = true;
  public subscribed: boolean = false;
  public currentBid: number;
  public subscription;

  constructor(private activatedRoute :ActivatedRoute, private productService: ProductService, private wsService: WebsocketService) { }

  ngOnInit(): void {
    this.getProductDetail();
  }

  getProductDetail():void {
    let productId: number  = this.activatedRoute.snapshot.params['productId'];

    this.productService.getProduct(productId).subscribe({
      next: (data: Product) => {
        this.product = data;
        this.currentBid = data.price;
      },
      error: (err: any) => {
        console.log(err);
      }
    });

    this.productService.getCommentsByProductId(productId).subscribe({
      next: (data: Comment[]) => {
        this.comments = data;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  addComment(): void {
    let comment: Comment = {
      id: 0,
      productId: this.product.id,
      timeStamp: new Date().toISOString(),
      user: 'admin',
      rating: this.newRating,
      content: this.newComment
    };

    this.comments.unshift(comment);
    this.newComment = '';
    this.newRating = 0;
    this.isCommentHidden = true;

    this.updateAverage();
  }

  updateAverage(): void {
    let sum = this.comments.reduce((sum, comment) => sum + comment.rating, 0);

    this.product.rating = sum/this.comments.length;
  }

  subscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscribed = false;
      this.subscription = null;
    } else {
      this.subscribed = true;
      this.subscription = this.wsService.createObservableSocket("ws://localhost:8085", this.product.id).subscribe(
          data => {
            let product = data.find(p => p.productId === this.product.id);
            this.currentBid = product.bid;
      });
    }
  }

}
