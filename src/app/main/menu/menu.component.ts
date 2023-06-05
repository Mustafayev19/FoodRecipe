import { Component } from '@angular/core';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  // menu for Write
  menu: string[] = ["M", "E", "N", "U"]
  menuList: string[] = ["AAAxeqccw", "BcwrcwrcwrcrcwBB", "CCCcwrc", "DccccccccccccDD"]

  constructor() { }
}
