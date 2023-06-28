import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Recipe, SearchedRecipe, randomJoke } from 'src/app/services/Irecipe';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  // menu for Write
  menu: string[] = ["M", "E", "N", "U"];
  menuList: string[] = [
    "main course",
    "dessert",
    "appetizer",
    "salad",
    "breakfast",
    "soup",
    "sauce",
    "marinade",
    "drink"
  ];
  Ids: SearchedRecipe[] = [];
  searchedMenuRecipes: Recipe[] = [];
  randomJoke!: randomJoke;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipeService.searchedMenuRecipes.subscribe((recipes: Recipe[]) => {
      this.searchedMenuRecipes = recipes;
    });
    this.getRandomJoke();
  }

  getMenuSearchedRecipesIds(type: string) {
    this.recipeService.getMenuSearches(type).subscribe(response => {
      this.Ids = response
      this.getRecipesByIds();

    });
    console.log
  }

  getRecipesByIds() {
    const recipeObservables = this.Ids.map(SearchedRecipe => this.recipeService.getRecipeById(SearchedRecipe.id));
    forkJoin(recipeObservables).subscribe(recipes => {
      this.searchedMenuRecipes = recipes;
      this.recipeService.searchedMenuRecipes.next(this.searchedMenuRecipes);
    });

  }


  getRandomJoke(): void {
    this.recipeService.getRandomJoke().subscribe((response: randomJoke) => {
      this.randomJoke = response;
    });
  }
}
