import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit {
  public stars: boolean[] = new Array(5);

  @Input()
  public readonly: boolean = true;

  @Input()
  public rating: number;

  @Output()
  public ratingChange: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnChanges(): void {
    this.fillStar();
  }

  ngOnInit(): void {

  }

  fillStar(): void {
    this.stars.fill(true, 0, this.rating).fill(false, this.rating, 5);
  }

  clickStar(key: number): void {
    if(!this.readonly) {
      this.rating = key + 1;
      this.ratingChange.emit(this.rating);
    }
  }

}
