import { Component, OnInit } from '@angular/core';
import { randomJoke } from 'src/app/services/Irecipe';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  // menu for Write
  menu: string[] = ["M", "E", "N", "U"];
  menuList: string[] = ["AAAxeqccw", "BcwrcwrcwrcrcwBB", "CCCcwrc", "DccccccccccccDD"];
  randomJoke!: randomJoke;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.getRandomJoke();
  }

  getRandomJoke(): void {
    this.recipeService.getRandomJoke().subscribe((response: randomJoke) => {
      this.randomJoke = response;
    });
  }
}
