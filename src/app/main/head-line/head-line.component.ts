import { Component } from '@angular/core';

@Component({
  selector: 'head-line',
  templateUrl: './head-line.component.html',
  styleUrls: ['./head-line.component.css']
})
export class HeadLineComponent {
  search: boolean = false;



  constructor() { }


  issearch(): void {
    this.search = !this.search;


  }
}
