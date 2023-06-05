import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/services/Irecipe';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  recipes: Recipe[] = [];
  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.getRecipes();
  }



  getRecipes(): void {
    this.recipeService.getRandomRecipes(4).subscribe(recipes => {
      this.recipes = recipes;
    });
  }
}
