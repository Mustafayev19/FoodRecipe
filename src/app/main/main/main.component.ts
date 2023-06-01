import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/services/Irecipe';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  randomRecipe!: Recipe;

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.getRecipe();
  }

  getRecipe() {
    this.recipeService.getRandomRecipe().subscribe(
      (recipe: Recipe) => {
        this.randomRecipe = recipe;
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }
}
